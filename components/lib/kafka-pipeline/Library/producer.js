const kafka = require('kafka-node');

const { HighLevelProducer } = kafka;
const { host, port } = require('../config').kafka;
const { noOfPartitions } = require('../config');

const client = new kafka.Client(`${host}:${port}`);
const producer = new HighLevelProducer(client);
console.log(`HOST: ${host}, PORT: ${port}`);

let isReady = false;
const messagesToSend = [];

producer.on('ready', () => {
  isReady = true;
  const topicCount = {};

  setInterval(() => {
    const topicCountCopy = JSON.parse(JSON.stringify(topicCount));
    const ts = new Date().getTime();
    const sendMsgs = Object.keys(topicCount).map((topic) => {
      topicCount[topic] -= topicCountCopy[topic]; return {
        topicName: topic,
        topicCount: topicCountCopy[topic],
        ts,
      };
    });
    producer.send([{ topic: 'monitor', messages: sendMsgs.map(msg => JSON.stringify(msg)) }], (err, reply) => {
      if (err) { console.error('err:', err); }
    });
  }, 1000);

  let partitionId = 0;

  function getNextPartition() {
    const ret = partitionId;
    partitionId = (partitionId + 1) % noOfPartitions;
    return ret;
  }

  setInterval(() => {
    const msgs = messagesToSend.splice(0, messagesToSend.length);

    const msgsWithPartitionId = [];

    msgs.forEach((payloadItem) => {
      const obj = JSON.parse(JSON.stringify(payloadItem));
      partitionId = getNextPartition();
      obj.partition = partitionId;
      msgsWithPartitionId.push(obj);
    });

    if (msgsWithPartitionId.length > 0) {
      producer.send(msgsWithPartitionId, (err) => {
        msgsWithPartitionId.forEach((payloadItem) => {
          const topic = payloadItem.topic;
          const count = payloadItem.messages.length;
          if (!Object.prototype.hasOwnProperty.call(topicCount, topic)) { topicCount[topic] = 0; }
          topicCount[topic] += count;
        });

        console.log(`Messages Produced! - ${msgsWithPartitionId.length} - topic - ${msgsWithPartitionId[0].topic}`);
      });
    }
  }, 1000);
});

function send(msgs) {
  Array.prototype.push.apply(messagesToSend, msgs);
}

function ready(callback) {
  if (isReady) { callback(); return; }

  const interval = setInterval(() => {
    if (isReady) { clearInterval(interval); callback(); }
  }, 1000);
}

module.exports = { send, ready };
