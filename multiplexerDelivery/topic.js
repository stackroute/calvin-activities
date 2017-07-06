const kafka = require('kafka-node');

// const client = require('./db').client;
const kafkaClient = require('../client/kafkaclient');

const Producer = kafka.Producer;

const producer = new Producer(kafkaClient.client);


producer.on('ready', () => {
  producer.createTopics(['testing'], true, (err, data) => {
    if (err) { console.log(err); }
    console.log(data);
  });
});

