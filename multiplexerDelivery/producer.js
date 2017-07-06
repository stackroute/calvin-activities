const kafka = require('kafka-node');
// const config =require('./config.json');
// const client = require('./db').client;
// const topic = require('./db').topic;
const kafkaClient = require('../client/kafkaclient');

const Producer = kafka.Producer;
const KeyedMessage = kafka.KeyedMessage;

const producer = new Producer(kafkaClient.client);
// km = new KeyedMessage('key', 'message'),
// const msg1 = {
//   payload: {
//     name: 'abcefghij',
//   },
//   mailboxId: 'b76900c0-d34d-4ebc-86c6-589ff4bd1c65',
// };
// const msg2 = {
//   payload: {
//     name: 'abc',
//   },
//   mailboxId: '0b8ce7ad-8cac-4f59-92bc-e373330fe146',

// };
const msg1 = {
  payload: {
    name: 'KafkaTesting',
  },
  mailboxId: '0b8ce7ad-8cac-4f59-92bc-e373330fe146',
};
const msg2 = {
  payload: {
    name: 'abc',
  },
  mailboxId: '0b8ce7ad-8cac-4f59-92bc-e373330fe146',
};
const payloads = [
  { topic: 'testingKafka', messages: JSON.stringify(msg1) },
  // { topic: 'topic', messages: [msg1, msg2], partition: 0 },

];
producer.on('ready', () => {
  producer.send(payloads, (err, data) => {
    console.log(data);
  });
});

producer.on('error', (err) => {});
