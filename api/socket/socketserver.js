const activityDAO = require('../../dao').activity;
const authorize = require('../../authorize');

function bootstrapSocketServer(io) {
  io.on('connection', (socket) => {
    socket.on('publish', (data) => {
      activityDAO.publishToMailbox(data.mid, data.message, (err, result) => {});
    });

    socket.on('authorize', (auth) => {
      if (authorize.verify(auth, 'mailbox:all')) {
        socket.on('startListeningToMailbox', (mid) => {
          activityDAO.addListnerToMailbox(mid, socket);
        });

        socket.on('stopListeningToMailbox', (mid) => {
          activityDAO.removeListnerFromMailbox(mid, socket);
        });
      }
    });
  });
}

module.exports = bootstrapSocketServer;
