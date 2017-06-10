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
socket.on('newLocationMessage',function(message){
    var li=jQuery('<li></li>');
    li.text(`${message.from}: ` );
    var a=jQuery('<a target=_blank>My Current Location</a>');
    a.attr('href',message.url);
    li.append(a);
    jQuery('#messages').append(li);
});
var locationButton=jQuery('#send-location');
locationButton.on('click',function(){
    
    if(!navigator.geolocation){
        return alert('Geo Location not supported by your browser');
    }
    locationButton.attr('disabled','disabled').text('Sending Location');
    navigator.geolocation.getCurrentPosition(function(position){
        //console.log(position);
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        });
    },function(){
        locationButton.removeAttr('disabled').text('Send Location');
        return alert('Unable to fetch Geo-Location');
    });
});
jQuery('#message-form').on('submit',function(e){
    e.preventDefault();
    var textBoxMessage=jQuery('[name=message]');
   // console.log("hi");
    socket.emit('createMessage',{
        from:'satish',
        text:textBoxMessage.val()
    },function(){
        textBoxMessage.val("");
    });
});