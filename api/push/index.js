function push(socket){
socket.on('connection', function(client){ 
    console.log('Connection to client established');

    client.on('message',function(event){ 
        console.log('Received message from client!',event);
        socket.emit('res',"hello");
    });

    client.on('disconnect',function(){
        console.log('Server has disconnected');
    });
});
}

 module.exports=push;