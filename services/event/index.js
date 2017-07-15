const kafkaClient = require('../../client/kafkaclient');

const producer = kafkaClient.producer;

function sendevent(event) {
  const messages = JSON.stringify(event);
  payloads = [
    {
      topic: 'events', messages, partition: 0,
    },
  ];
  producer.send(payloads, (err, data) => {
    console.log(data);
  });
  producer.on('error', (err) => { console.log('errr'); });
}

module.exports = {
  sendevent,
};

