let kafka = require('kafka-node'),
  Consumer = kafka.Consumer,
  ConsumerGroup = kafka.ConsumerGroup,
  client = new kafka.Client();

offset = new kafka.Offset(client);
const async = require('async');

function registerConsumer(topicName, consumerGroupname, callback) {
  const options = {
    host: '172.23.238.134:2181',
    groupId: `${consumerGroupname}`,
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'none', // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
  };
  const consumerGroup1 = new ConsumerGroup(options, topicName);
  consumerGroup1.on('message', onMessage);
  console.log('inside group');
  function onMessage(message) {
    return callback(`${message.value} , partition:${message.partition} , offset :${message.offset}`);
    // console.log('msg :'+message.value);
  }
}

module.exports = { registerConsumer };
