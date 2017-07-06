const config =require('../config').kafka;
const kafka = require('kafka-node');

// const client = new kafka.Client(config.connectionString, config.clientId);
const client = new kafka.Client(`${config.host}:${config.port}`, config.clientId);
module.exports = {
  client,
};
const Consumer = kafka.Consumer;
const topics = config.topics;
const options = config.options;

const consumer = new Consumer(client, [topics], options);
module.exports={
  consumer, client,
};

