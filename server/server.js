
const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
var app=express();
const {generateMessage,generateLocationMessage}=require('./utils/message');
const {isRealString}=require('./utils/validation');
const {Users}=require('./utils/users');
var publicPath=path.join(__dirname,"../public");
app.use(express.static(publicPath));
const port=process.env.PORT || 3000;
var server=http.createServer(app);

var users=new Users();
var io=socketIO(server);
io.on('connection',(socket)=>{
    console.log("New User Connected");

    socket.on('join',(params,callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room))
        {
            callback('Name and Room are required');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);
        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        
        socket.emit('newMessage',generateMessage(params.name,'Welcome To ChatMessage'));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} joined`));
        callback();
    });
    socket.on('disconnect',()=>{
        var user=users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin:',`${user.name} has left `));
        }
        console.log("Client Disconnected");
    })
    
    socket.on('createMessage',(message,callback)=>{
        var user=users.getUser(socket.id);
        io.emit('newMessage',generateMessage(user.name,message.text)); 
        callback('This is from Server');
    });
    socket.on('createLocationMessage',(coords)=>{
        io.emit('newLocationMessage',generateLocationMessage('user',coords))
    });
        
});
server.listen(port,()=>{
    console.log(`server listening on port ${port}`);
});
