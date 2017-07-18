const producer = require('../../client/kafkaclient').producer;

function sendevent(event) {
  const messages = JSON.stringify(event);
  const payloads = [
    {
      topic: 'eventsTest', messages, partition: 0,
    },
  ];
  producer.send(payloads, (err, data) => {
    if (err) { throw err; }
  });
  producer.on('error', (err) => { 
    if (err) { throw err; }
  });
}

module.exports = {
  sendevent,
};

