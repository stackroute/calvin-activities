const authorize = require('../../authorize');
const subscriber = require('../../client/redisclient').client;
const producer = require('../../client/kafkaclient').producer;
const eventService = require('../../services/event');
const adapter = require('../../dao/cassandra/adapter');

function bootstrapSocketServer(io) {
  io.on('connection', (socket) => {
    subscriber.on('message', (channel, data) => {
      socket.broadcast.to(channel).emit('newActivity', data);
    });
    socket.on('authorize', (auth) => {
      if (authorize.verify(auth, 'mailbox:all')) {
        socket.on('startListeningToMailbox', (id) => {
          if (id.mid !== null) {
            socket.join(id.mid);
            subscriber.subscribe(id.mid);
            const obj = {
              mailboxId: id.mid,
              event: 'useronline',
            };
            eventService.sendevent(obj);
          } else if (id.user !== null) {
            adapter.checkIfUserExists(id.user, (err, result) => {
              if (err) {
                throw err;
              }
              socket.join(result.mailboxid);
              subscriber.unsubscribe(result.mailboxid);
              const obj = {
                mailboxId: id.user,
                event: 'useronline',
              };
              eventService.sendevent(obj);
            });
          } else {
            socket.emit('message', 'User mapping does not exists');
          }
        });
        socket.on('stopListeningToMailbox', (id) => {
          if (id.mid !== null) {
            socket.leave(id.mid);
            subscriber.unsubscribe(id.mid);
            const obj = {
              mailboxId: id.mid,
              event: 'useroffline',
            };
            eventService.sendevent(obj);
          } else if (id.mid === null && id.user !== null) {
            adapter.checkIfUserExists(id.user, (err, result) => {
              if (err) {
                throw err;
              }
              socket.leave(result.mailboxid);
              subscriber.unsubscribe(result.mailboxid);
              const obj = {
                mailboxId: id.mid,
                event: 'useroffline',
              };
              eventService.sendevent(obj);
            });
          } else {
            socket.emit('message', 'User mapping does not exists');
          }
        });
      }
    });
  });
}

module.exports = bootstrapSocketServer;