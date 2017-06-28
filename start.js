const app = require('./app');
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('./api/socket/socketserver')(io);

const winston = require('./winston');

server.listen(3000, () => {
  winston.log('info', 'Express server listening on port:', 3000);
});
