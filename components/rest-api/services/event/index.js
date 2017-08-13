const kafkaPipeline = require('kafka-pipeline');
const eventsTopic = require('../../config').kafka.eventsTopic;

function sendevent(event) {
  kafkaPipeline.producer.ready(function() {
    const payloads = [{topic: eventsTopic, messages : JSON.stringify(event)}];
    console.log(payloads);
    kafkaPipeline.producer.send(payloads);
    });
  }
  
module.exports = {
  sendevent,
};

