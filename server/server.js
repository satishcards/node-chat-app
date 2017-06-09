
const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
var app=express();
const {generateMessage,generateLocationMessage}=require('./utils/message');
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
    socket.on('createMessage',(message,callback)=>{
        io.emit('newMessage',generateMessage(message.from,message.text)); 
        callback('This is from Server');
    });
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('user',coords))
    },()=>{

    });
        
});
server.listen(port,()=>{
    console.log(`server listening on port ${port}`);
});
