const kafka = require('kafka-node');

const kafkaClient = require('../client/kafkaclient');

const Producer = kafka.Producer;

const producer = new Producer(kafkaClient.client);


producer.on('ready', () => {
  producer.createTopics(['M1D'], true, (err, data) => {

  });
});

