const activityDAO = require('../../dao').activity;
const authorize = require('../../authorize');
const subscriber = require("redis").createClient([{host:'172.23.238.134', port:'6379'}]);

function bootstrapSocketServer(io) {
  io.on('connection', (socket) => {
    socket.on('publish', (data) => {
      activityDAO.publishToMailbox(data.mid, data.message, (err, result) => {});
    });

  subscriber.on('message',function(channel, data){
    activityDAO.publishActivityToListeners(channel, data);
  });
  socket.on('authorize', (auth) => {
      if (authorize.verify(auth, 'mailbox:all')) {
        socket.on('startListeningToMailbox', (mid) => {
          activityDAO.addListnerToMailbox(mid, socket);
          subscriber.subscribe(mid);
        });

        socket.on('stopListeningToMailbox', (mid) => {
          activityDAO.removeListnerFromMailbox(mid, socket);
        });
      }
    });
  });
}

module.exports = bootstrapSocketServer;
