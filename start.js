const app = require('./app');
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('./api/socket/socketserver')(io);
const async = require('async');
const ConsumerGroup = require('kafka-node').ConsumerGroup;

const winston = require('./winston');

const options = {
  host: '172.23.238.205:2181',
  groupId: 'monitor',
  protocol: ['roundrobin'],
  fromOffset: 'latest' 
};

const consumerGroup1 = new ConsumerGroup(options, 'monitor');
consumerGroup1.on('message', onMessage);

let messages = new Array();
let messagesDelivered = 0;
setInterval(function(){ 
   let sum = 0;
   messages.forEach(function(element) {
     sum+=element;
   });
   messagesDelivered = sum;
   io.to('monitoring').emit('msg', { messagesDelivered  }); 
   messages = [];
	}, 1000);


function onMessage (message) {
  console.log(message.value);
  if(JSON.parse(message.value).CID){ 
     messages.push(JSON.parse(message.value).CDR);
  }
  if(JSON.parse(message.value).topicName){ 
      io.to('monitoring').emit('msg', message.value);
  }
  if(JSON.parse(message.value).consumerGroup){ 
      io.to('monitoring').emit('msg', message.value);
  }
  
}

process.once('SIGINT', function () {
  async.each([consumerGroup1], function (consumer, callback) {
    consumer.close(true, callback);
  });
});

io.on('connection', (socket) => {
  console.log('a client connected');
  socket.join('monitoring');
});

server.listen(3000, () => {
  winston.log('info', 'Express server listening on port:', 3000);
});
