const authorize = require('../../authorize');
const eventService = require('../../services/event');
const adapter = require('../../dao/cassandra/adapter');

const config = require('../../config').redis;

const redis = require('redis');

const subscriber = redis.createClient({
  host: config.host,
  port: config.port,
});

function bootstrapSocketServer(io) {
  subscriber.on('message', (channel, data) => {
      io.to(channel).emit('newActivity', data);
    });
  io.on('connection', (socket) => {
    socket.on('authorize', (auth) => {
      if (authorize.verify(auth, 'mailbox:all')) {
        socket.on('startListeningToMailbox', (id) => {
          if (id.mid !== null && id.mid !== undefined) {
            socket.join(id.mid);
            subscriber.subscribe(id.mid);
            const obj = {
              mailboxId: id.mid,
              event: 'useronline',
            };
            eventService.sendevent(obj);
          } else if (id.user !== null && id.user !== undefined) {
            adapter.checkIfUserExists(id.user, (err, result) => {
              if (err) { throw err; }
              socket.join(result.mailboxid.toString());
              subscriber.subscribe(result.mailboxid.toString());
              const obj = {
                mailboxId: result.mailboxid.toString(),
                event: 'useronline',
              };
              eventService.sendevent(obj);
            });
          } else if (id.domain !== null && id.domain !== undefined) {
            adapter.checkIfDomainExists(id.domain, (err, result) => {
              if (err) { throw err; }
              socket.join(result.mailboxid.toString());
              subscriber.subscribe(result.mailboxid.toString());
            });
          } else {
            socket.emit('message', 'mapping does not exists');
          }
        });
        socket.on('stopListeningToMailbox', (id) => {
          if (id.mid !== null && id.mid !== undefined) {
            socket.leave(id.mid);
            subscriber.unsubscribe(id.mid);
            const obj = {
              mailboxId: id.mid,
              event: 'useroffline',
            };
            eventService.sendevent(obj);
          } else if (id.user !== null && id.user !== undefined) {
            adapter.checkIfUserExists(id.user, (err, result) => {
              if (err) { throw err; }
              socket.leave(result.mailboxid.toString());
              subscriber.unsubscribe(result.mailboxid.toString());
              const obj = {
                mailboxId: result.mailboxid.toString(),
                event: 'useroffline',
              };
              eventService.sendevent(obj);
            });
          } else if (id.domain !== null && id.domain !== undefined) {
            adapter.checkIfDomainExists(id.domain, (err, result) => {
              if (err) { throw err; }
              socket.leave(result.mailboxid.toString());
              subscriber.unsubscribe(result.mailboxid.toString());
            });
          } else {
            socket.emit('message', 'mapping does not exists');
          }
        });
      }
    });
  });
}

module.exports = bootstrapSocketServer;
