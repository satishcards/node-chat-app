 var socket=io();

socket.on('connect',function(){
    console.log('Connected to Server');
    socket.emit('newEmail',{to:'satish',text:'Hey'});
})
socket.on('disconnect',function(){
    console.log("Disconnected from Server");
});
socket.on('newMessage',function(message){
    console.log('New Message',message);
    var li=jQuery('<li></li');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});
// socket.emit('createMessage',{
//     from:'satish',
//     text:'Hi'
// },function(data){
//     console.log('Got it',data);
// });

jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    console.log("hi");
    socket.emit('createMessage',{
        from:'satish',
        text:jQuery('[name=message]').val()
    },function(){

    });
});