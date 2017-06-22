require('http').createServer();
const io = require('socket.io').listen(5000);

const activityDAO = require('../dao').circle;

io.on('connection', (socket) => {
  socket.on('publish', (data) => {
    activityDAO.publishActivityToMailbox(data.mid, data.message);
  });

  socket.on('startListeningToMailbox', (mid) => {
    activityDAO.addListnerToMailbox(mid, socket);
  });

  socket.on('stopListeningToMailbox', (mid) => {
    activityDAO.removeListnerFromMailbox(mid, socket);
  });
});
