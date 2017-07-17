const kafka = require('kafka-node');

const { HighLevelProducer } = kafka;
const { host, port } = require('./config').kafka;

const client = new kafka.Client(`${host}:${port}`);
const producer = new HighLevelProducer(client);
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
    console.log('reply:', reply);
  });
  console.log('topic');
}, 5000); function send(...args) {
  args[0].forEach((payloadItem) => {
    const topic = payloadItem.topic;
    const count = payloadItem.messages.length;
    console.log('count==>', count);
    if (!topicCount.hasOwnProperty(topic)) { topicCount[topic] = 0; }
    topicCount[topic] += count;
  }); producer.send(args[0], (err, reply) => {
    console.log('args', args[0]);
    if (err) { console.error('err:', err); return; }
    console.log('reply:', reply);
  });
}
function ready(callback) {
  producer.on('ready', callback);
}module.exports = { send, ready };
