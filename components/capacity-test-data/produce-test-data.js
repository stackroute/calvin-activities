const config = require('./config').kafka;

const noOfPartitions = require('./config').noOfPartitions;

const kafkaPipeline = require('kafka-pipeline');

const topic = config.topics.topic;

const n = config.numberOfMessages;

function addActivity(n, callback) {
  console.log(`PREPARING ${n} records for topic ${topic}`);
  const messages = [];
  for (let i=0; i<n; i++) {
    messages.push(JSON.stringify({circleId: 'baz'}));
  }

  console.log(`PRODUCING ${n} records`);
  const send = [];
  kafkaPipeline.producer.ready(function() { 
 
    for (let i=0; i<noOfPartitions; i++) {
      send.push({ topic, messages: i===noOfPartitions-1 ? messages : messages.splice(0, n/noOfPartitions) });
    }
    console.log(`PUSHING: ${JSON.stringify(send)}`);
    kafkaPipeline.producer.send(send, callback);
 });
}

addActivity(n, (err, result) => {
  if (err) { console.log('error:', err); return; }
  console.log(`PRODUCED ${n} records`);
});
