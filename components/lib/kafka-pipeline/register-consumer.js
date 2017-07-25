const kafka = require('kafka-node');

const { ConsumerGroup, Client, HighLevelProducer } = kafka;
const { host, port } = require('./config').kafka;

const client = new Client(`${host}:${port}`);
const producer = new HighLevelProducer(client);

const consumerId = Math.random() * 123456789;

function registerConsumer(topic, groupId, consumer) {
  const monitor = {
    F: 0,
    E: 0,
    D: 0,
    FC: parseInt(process.env.FC) || '-',
    DC: parseInt(process.env.DC) || '-',
    groupId,
    consumerId
  };

 producer.on('ready', () => {
    setInterval(function() {
      const monitorCopy = JSON.parse(JSON.stringify(monitor));
      monitor.F -= monitorCopy.F;
      monitor.E -= monitorCopy.E;
      monitor.D -= monitorCopy.D;
     producer.send([{topic: 'monitor', messages: JSON.stringify(monitorCopy)}], (err, result) => {
        if(err) { console.error('ERR:', err); return; }
      });
    }, 1000);
  });

 const options = {
    host: `${host}:${port}`,
    groupId,
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest',
  };

 const consumerGroup = new ConsumerGroup(options, topic);
  consumerGroup.on('message', (msg) => {
    monitor.F++;
    consumer(JSON.parse(JSON.stringify(msg.value)), function(err) {
      if(err) { monitor.E++; console.log('nok'); return; }
      monitor.D++;
      console.log('ok');
    });
  });
}

module.exports = registerConsumer;