const app = require('./app');
var server = require('http').Server(app);
var io = require('socket.io')(server);
require('./socket/socketserver')(io);

const winston = require('./winston');

server.listen(3000, () => {
  winston.log('info', 'Express server listening on port:', 3000);
});
