const config = require('./config').kafka;

const kafkaPipeline = require('kafka-pipeline');

const topic = config.topics.topic;

const n = config.numberOfMessages;

let msg = null;

if (topic.indexOf('D') > -1) {
  msg = JSON.stringify({
    payload: {
      foo: 'bar',
    },
    mailboxId: '9da64d71-fc74-4c45-9249-153d4751c7a6',
  });
} else {
  msg = JSON.stringify({
    payload: {
      foo: 'bar',
    },
    circleId: 'baz',
  });
}

function addActivity(n, callback) {
  console.log(`PREPARING ${n} records for topic ${topic}`);
  const messages = [];
  for (let i=0; i<n; i++) {
    messages.push(JSON.stringify({circleId: 'baz'}));
  }

  console.log(`PRODUCING ${n} records`);
  const send = [];
  kafkaPipeline.producer.ready(function() { 
 
    for (let i=0; i<10; i++) {
      send.push({ topic, messages: i===9 ? messages : messages.splice(0, n/10) });
    }
    console.log(`PUSHING: ${JSON.stringify(send)}`);
    kafkaPipeline.producer.send(send, callback);
 });
}

addActivity(n, (err, result) => {
  if (err) { console.log('error:', err); return; }
  console.log(`PRODUCED ${n} records`);
});
