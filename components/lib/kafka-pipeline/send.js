const kafka = require('kafka-node');

const { HighLevelProducer } = kafka;

const { host, port } = require('./config').kafka;

const client = new kafka.Client(`${host}:${port}`);
const producer = new HighLevelProducer(client);

const topicCount = {};
// console.log('client==>',client);

setInterval(function() {
   console.log('running');
  
  const topicCountCopy = JSON.parse(JSON.stringify(topicCount));
  const ts = new Date().getTime();
  const send = Object.keys(topicCount).map((topic) => {
    topicCount[topic] -= topicCountCopy[topic];
    // console.log('topicCountCopy',topicCountCopy);
    return {
      topicName: topic,
      topicCount: topicCountCopy[topic],
      ts,
    };
  });

  // producer.on('ready', () => {
    producer.send([{topic: 'monitor', messages: send.map((msg) => JSON.stringify(msg))}], (err,reply) =>{
      if(err) { console.error('err:', err); return; }
     // console.log('reply:', reply);
    });
  // });


  producer.on('error', function (err) {});

}, 3000);


function send(...args) {
  args[0].forEach((payloadItem) => {
    const topic = payloadItem.topic;
    const count = payloadItem.messages.length;
   
    if (!topicCount.hasOwnProperty(topic)) { topicCount[topic] = 0; }
    topicCount[topic] += count;
  });

  producer.on('ready', () => {
    producer.send(args[0], (err, reply) => {
      if (err) { console.error('err:', err); return; }
      console.log('reply:', reply);
    });
  // });
  producer.on('error', function (err) {})
}

module.exports = send;