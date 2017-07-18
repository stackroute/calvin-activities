// const { producer } = require('./client/kafkaclient');
const config = require('./config').kafka;

const producer = require('../lib/kafka-pipeline/Library/register-producer');
const {send} = producer;


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
  console.log(`PREPARING ${n} records`);
  const messages = [];
  for (let i=0; i<n; i++) {
    messages.push(msg);
  }

  console.log(`PRODUCING ${n} records`);
  const sends = [];
  producer.ready(function() { 
 
    for (let i=0; i<10; i++) {
      sends.push({ topic, partition: i, messages: i===9 ? messages : messages.splice(0, n/10) });
      
    }
    send([{topic: topic, messages:[JSON.stringify({sends})]}]);
 });
}

addActivity(n, (err, result) => {
  if (err) { console.log('error:', err); return; }
  console.log('PRODUCED ${n} records');
});
