const kafka = require('kafka-node');

const { ConsumerGroup, Client } = kafka;
const { host, port } = require('./config').kafka;

function registerConsumer(topic, groupId, consumer) {
  const options = {
    host: `${host}:${port}`,
    groupId,
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest',
  };

  const consumerGroup = new ConsumerGroup(options, topic);
  consumerGroup.on('message', (msg) => {
    // console.log('message:', message);
    consumer(JSON.parse(msg.value), (err) => {
      if (err) { console.log('nok'); return; }
      console.log('ok');
    });
  });
}

module.exports = registerConsumer;
