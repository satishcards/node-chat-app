
const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
var app=express();

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
    socket.on('createMessage',(message)=>{
        io.emit('newMessage',message);
        console.log(message);
    });
    

})
server.listen(port,()=>{
    console.log(`server listening on port ${port}`);
});
