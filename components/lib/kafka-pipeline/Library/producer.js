 const kafka = require('kafka-node');

const { HighLevelProducer } = kafka;
const { host, port } = require('../config').kafka;
const { noOfPartitions } = require('../config');

const client = new kafka.Client(`${host}:${port}`);
const producer = new HighLevelProducer(client);
console.log(`HOST: ${host}, PORT: ${port}`);

let isReady = false;
producer.on('ready', () => {
  isReady = true;

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

  const topicCount = {};

  let partitionId = 0;

  function getNextPartition() {
    const ret = partitionId;
    partitionId = (partitionId + 1) % noOfPartitions;
    return ret;
  }

  setInterval(function() {
    const msgs = messagesToSend.splice(0, messagesToSend.length);

    msgs.forEach((payloadItem) => {
      const partitionId = getNextPartition();
      console.log('partitionId:', partitionId);
      payloadItem.partition = partitionId;
    });

    if(msgs.length > 0) {
      console.log('msgs:', msgs);
      producer.send(msgs, (err) => {
        msgs.forEach((payloadItem) => {
          const topic = payloadItem.topic;
          const count = payloadItem.messages.length;
          if (!topicCount.hasOwnProperty(topic)) { topicCount[topic] = 0; }
          topicCount[topic] += count;
        });

        console.log('Messages Produced!');
      });
    }
  }, 1000);
});

const messagesToSend = [];

function send(msgs) {
  Array.prototype.push.apply(messagesToSend, msgs);
}

function ready(callback) {
  if(isReady) { callback(); return; }

  const interval = setInterval(() => {
    if(isReady) { clearInterval(interval); callback(); }
  }, 1000);
}

module.exports = { send, ready };
