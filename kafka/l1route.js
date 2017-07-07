const config = require('./config.json');

const kafka = require('kafka-node');

const client = new kafka.Client(config.connectionString, config.clientId);

const topics = config.topics;

const options = config.options;

const Consumer = kafka.Consumer;

const consumer = new Consumer(client, [topics], options);

const Producer = kafka.Producer;

const producer = new Producer(client);

module.exports = {
  consumer,
  producer,
};
