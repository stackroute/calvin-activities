const config =require('../config').kafka;

const kafka = require('kafka-node');

const client = new kafka.Client(`${config.host}:${config.port}`);

const Producer = kafka.Producer;

const producer = new Producer(client);

module.exports = {
  producer,
};
