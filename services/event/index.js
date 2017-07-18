const kafkaClient = require('../../client/kafkaclient');

// const producer = kafkaClient.producer;

const producer = require('../../components/lib/kafka-pipeline/Library/register-producer');
const {send} = producer;

function sendevent(event) {
  const messages = JSON.stringify(event);
  payloads = [
    {
      topic: 'eventsTest', messages, partition: 0,
    },
  ];
  producer.ready(function() { 
  sends(payloads);
  });
}

module.exports = {
  sendevent,
};

