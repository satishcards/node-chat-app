
const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
var app=express();
const {generateMessage}=require('./utils/message');
var publicPath=path.join(__dirname,"../public");
app.use(express.static(publicPath));
const port=process.env.PORT || 3000;
var server=http.createServer(app);

var io=socketIO(server);
io.on('connection',(socket)=>{
    console.log("New User Connected");
    socket.on('disconnect',()=>{
        console.log("Client Disconnected");
    })
    socket.emit('newMessage',generateMessage('Admin','Welcome To ChatMessage'));
    socket.broadcast.emit('newMessage',generateMessage('Admin','New User joined'));
    socket.on('createMessage',(message)=>{
        io.emit('newMessage',generateMessage(message.from,message.text)); 
    });
        // socket.broadcast.emit('newMessage',{
        //     from:message.from,
        //     text:message.text,
        //     createdAt: new Date().getTime()
        // });
        //console.log(message);
    //});
    

});
server.listen(port,()=>{
    console.log(`server listening on port ${port}`);
});
