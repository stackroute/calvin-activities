const authorize = require('../../authorize');
const subscriber = require('redis').createClient([{ host: '172.23.238.134', port: '6379' }]);

function bootstrapSocketServer(io) {
  io.on('connection', (socket) => {
    subscriber.on('message', (channel, data) => {
      socket.broadcast.to(channel).emit('newActivity', data);
    });
    socket.on('authorize', (auth) => {
      if (authorize.verify(auth, 'mailbox:all')) {
        socket.on('startListeningToMailbox', (mid) => {
          socket.join(mid);
          subscriber.subscribe(mid);
        });
        socket.on('stopListeningToMailbox', (mid) => {
          socket.leave(mid);
        });
      }
    });
  });
}

module.exports = bootstrapSocketServer;

