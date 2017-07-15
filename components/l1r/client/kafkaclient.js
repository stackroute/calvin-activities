const uuidv4 = require('uuid/v4');

const config =require('../config').kafka;

const kafka = require('kafka-node');

const client = new kafka.Client(`${config.host}:${config.port}`);

const topics = config.topics;

const options = config.options;

const ConsumerGroup = require('kafka-node').ConsumerGroup;

const consumer = new ConsumerGroup(Object.assign({ id: uuidv4() }, options), topics);

const Producer = kafka.Producer;

const producer = new Producer(client);

module.exports = {
  consumer,
  producer,
};
