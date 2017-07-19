const kafka = require('kafka-node');

const { HighLevelProducer } = kafka;
const { host, port } = require('../config').kafka;

const client = new kafka.Client(`${host}:${port}`);
const producer = new HighLevelProducer(client);
console.log(`HOST: ${host}, PORT: ${port}`);

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

let partitionId = 0;

function getNextPartition() {
  const ret = partitionId;
  partitionId = (partitionId + 1) % 10;
  return ret;
}

const messagesToSend = [];

setInterval(function() {
  console.log('messagesToSend:', messagesToSend);

  const msgs = messagesToSend.splice(0, messagesToSend.length);

  console.log('msgs:', msgs);

  msgs.forEach((payloadItem) => {
    payloadItem.partition = getNextPartition();
  });

  if(msgs.length > 0) {
    producer.send(msgs, (err) => {
      msgs.forEach((payloadItem) => {
        const topic = payloadItem.topic;
        const count = payloadItem.messages.length;
        if (!topicCount.hasOwnProperty(topic)) { topicCount[topic] = 0; }
        topicCount[topic] += count;
      });
    });
  }
}, 1000);

function send(msgs) {
  Array.prototype.push.apply(messagesToSend, msgs);

  /*producer.send(msgs, (err) => {
    if(err) { console.log('ERR:', err); }
  });*/
}

function ready(callback) {
  if(isReady) { callback(); return; }

  const interval = setInterval(() => {
    if(isReady) { clearInterval(interval); callback(); }
  }, 1000);
}

module.exports = { send, ready };
