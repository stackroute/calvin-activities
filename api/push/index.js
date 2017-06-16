// function push(socket) {
//   socket.on('connection', (client) => {
//     console.log('Connection to client established');

//     client.on('message', (event) => {
//       console.log('Received message from client!', event);
//       socket.emit('res', 'hello');
//     });

//     client.on('disconnect', () => {
//       console.log('Server has disconnected');
//     });
//   });
// }

// module.exports=push;
