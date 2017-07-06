const kafka = require('kafka-node');
<<<<<<< HEAD
// const config =require('./config.json');
// const client = require('./db').client;
// const topic = require('./db').topic;
const kafkaClient = require('../client/kafkaclient');

const Producer = kafka.Producer;
// const KeyedMessage = kafka.KeyedMessage;
=======

const kafkaClient = require('../client/kafkaclient');

const Producer = kafka.Producer;

>>>>>>> a9d629be75ffe6c5dd483ac0461f3c2975ca04d2

const producer = new Producer(kafkaClient.client);
const msg1 = {
  payload: {
<<<<<<< HEAD
    name: 'KafkaTesting',
=======
    name: 'CALVIN ACTIVITIES',
>>>>>>> a9d629be75ffe6c5dd483ac0461f3c2975ca04d2
  },
  mailboxId: '0b8ce7ad-8cac-4f59-92bc-e373330fe146',
};

const payloads = [
<<<<<<< HEAD
  { topic: 'testingKafka', messages: JSON.stringify(msg1) },
  // { topic: 'topic', messages: [msg1, msg2], partition: 0 },
=======
  { topic: 'M1D', messages: JSON.stringify(msg1) },

>>>>>>> a9d629be75ffe6c5dd483ac0461f3c2975ca04d2

];
producer.on('ready', () => {
  producer.send(payloads, (err, data) => {
<<<<<<< HEAD
    // console.log(data);
=======

>>>>>>> a9d629be75ffe6c5dd483ac0461f3c2975ca04d2
  });
});

producer.on('error', (err) => {});
