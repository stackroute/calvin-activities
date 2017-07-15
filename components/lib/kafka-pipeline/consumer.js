const kafka = require('kafka-node');

const { ConsumerGroup, Client } = kafka;

const options = {
  host: 'localhost:2181',
  groupId: 'foo1',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  fromOffset: 'earliest',
};

const consumerGroup = new ConsumerGroup(options, 'topic');
consumerGroup.on('message', (message) => {
  console.log('message:', message);
});
