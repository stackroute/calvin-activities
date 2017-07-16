// const kafkaClient = require('../../client/kafkaclient');

// const producer = kafkaClient.producer;

const producer = require('../../components/lib/kafka-pipeline/Library/register-producer');
const {send} = producer;


// function sendevent(event) {
//   const messages = JSON.stringify(event);
//   payloads = [
//     {
//       topic: 'eventsTest', messages, partition: 0,
//     },
//   ];
//   producer.send(payloads, (err, data) => {
//     console.log(data);
//   });
//   producer.on('error', (err) => { console.log('errr'); });
// }

// //
function sendevent(event) {
  const messages = JSON.stringify(event),
  payloads = [
  {
    topic: 'eventsTest', messages, partition:0,
  },
  ];
  producer.ready(function() {
  send(payloads);
});
}

module.exports = {
  sendevent,
};

