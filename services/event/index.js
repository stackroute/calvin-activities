const kafkaPipeline = require('kafka-pipeline');
const eventsTopic = require('../../config').kafka.eventsTopic;

function sendevent(event) {
  kafkaPipeline.producer.ready(function() {
    const payloads = [{topic: eventsTopic, messages : JSON.stringify(event)}];
    kafkaPipeline.producer.send(payloads, (err, data) => {
    if(err) { console.log(`${err}`); return;}
    console.log(data);
  });
  });
  }
  
module.exports = {
  sendevent,
};

