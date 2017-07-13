var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    ConsumerGroup = kafka.ConsumerGroup,
    client = new kafka.Client();
    offset = new kafka.Offset(client);
  var async = require('async');

function registerConsumer(kafkaConfig, topicName,consumerGroupname, callback) {
 var options = {
  host: kafkaConfig.host + ':' + kafkaConfig.port,
  groupId: `${consumerGroupname}`,
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  fromOffset: 'latest'
};
console.log('options.host'+options.host);
var consumerGroup = new ConsumerGroup(options, topicName);
consumerGroup.on('message', onMessage);

function onMessage (message) {
  console.log('message'+JSON.stringify(message));
       //TODO logging, record startTime, endTime
  return callback(message.value); 
}
}

module.exports = { registerConsumer };