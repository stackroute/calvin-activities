const config =require('../config').kafka;

const kafka = require('kafka-node');

const client = new kafka.Client(`${config.host}:${config.port}`);

const topics = config.topics;

const options = config.options;

const Consumer = kafka.Consumer;

const consumer = new Consumer(client, [topics], options);

const Producer = kafka.HighLevelProducer;

const producer = new Producer(client);

module.exports = {
  producer,
};
