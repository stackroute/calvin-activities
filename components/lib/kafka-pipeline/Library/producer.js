const kafka = require('kafka-node');

const { HighLevelProducer } = kafka;
const { host, port } = require('../config').kafka;

const client = new kafka.Client(`${host}:${port}`);
const producer = new HighLevelProducer(client);

let isReady = false;
producer.on('ready', () => {
  isReady = true;
});
const topicCount = {};
setInterval(() => {
  const topicCountCopy = JSON.parse(JSON.stringify(topicCount));
  const ts = new Date().getTime();
  const send = Object.keys(topicCount).map((topic) => {
    topicCount[topic] -= topicCountCopy[topic]; return {
      topicName: topic,
      topicCount: topicCountCopy[topic],
      ts,
    };
  });
  producer.send([{ topic: 'monitor', messages: send.map(msg => JSON.stringify(msg)) }], (err, reply) => {
    if (err) { console.error('err:', err); return; }
  });
}, 1000); 

function send(msgs, done) {
  msgs.forEach((payloadItem) => {
    const topic = payloadItem.topic;
    const count = payloadItem.messages.length;
    if (!topicCount.hasOwnProperty(topic)) { topicCount[topic] = 0; }
    topicCount[topic] += count;
  });
  producer.send(msgs, done);
}

function ready(callback) {
  if(isReady) { callback(); return; }

  const interval = setInterval(() => {
    if(isReady) { clearInterval(interval); callback(); }
  }, 1000);
}

module.exports = { send, ready };
