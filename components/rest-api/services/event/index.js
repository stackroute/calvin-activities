const kafkaClient = require('../../client/kafkaclient');

const kafkaPipeline = require('kafka-pipeline');

function sendevent(event) {
  const messages = JSON.stringify(event);
  payloads = [
    {
      topic: 'eventsTest', messages, partition: 0,
    },
  ];
  kafkaPipeline.producer.ready(function() {
    kafkaPipeline.producer.send(payloads, (err, data) => {
    if(err) { console.log(`${err}`); return;}
    console.log(data);
  });
  });
  }
  
module.exports = {
  sendevent,
};

