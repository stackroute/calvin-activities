const config =require('../config').kafka;
const kafka = require('kafka-node');

<<<<<<< HEAD
//const client = new kafka.Client(config.connectionString, config.clientId);
const client = new kafka.Client(config.host+ ':' + config.port);
=======
// const client = new kafka.Client(config.connectionString, config.clientId);
const client = new kafka.Client(`${config.host}:${config.port}`, config.clientId);
>>>>>>> 25fc2217c3baf8f05f57aa24c9937eebbfd3b688
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

