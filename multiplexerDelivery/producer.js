const kafka = require('kafka-node');

const kafkaClient = require('../client/kafkaclient');

const Producer = kafka.Producer;


const producer = new Producer(kafkaClient.client);
const msg1 = {
  payload: {
    name: 'CALVIN ACTIVITIES',
  },
  mailboxId: '0b8ce7ad-8cac-4f59-92bc-e373330fe146',
};

const payloads = [
  { topic: 'M1D', messages: JSON.stringify(msg1) },


];
producer.on('ready', () => {
  producer.send(payloads, (err, data) => {

  });
});

producer.on('error', (err) => {});
