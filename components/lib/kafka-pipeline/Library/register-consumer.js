const kafka = require('kafka-node');

const { ConsumerGroup, Client, HighLevelProducer } = kafka;
const { host, port } = require('../config').kafka;

const client = new Client(`${host}:${port}`);
const producer = new HighLevelProducer(client);

const consumerId = Math.random() * 123456789;

let startTime = null;

const redisClient = require('../client/redisclient').client;

function setStartTime(groupId) {
  startTime = new Date().getTime();
  redisClient.get(`monitor:${groupId}:startTime`)(function(err, reply) {
    if(err) { console.log('ERR:', err); return; }
    console.log('reply:', reply);
    if(!reply) {
      console.log('Setting Start Time:');
      redisClient.set(`monitor:${groupId}:startTime`, startTime)(function(err, reply) {
        if(err) { console.log('ERR:', err); return; }
        console.log('Set Start Time');
      });
    } else {
      console.log('Start Time already set');
    }
  });
}

let timeout = null;

function setEndTime(groupId) {
  const endTime = new Date().getTime();
  if(timeout) { clearTimeout(timeout); }
  timeout = setTimeout(function() {
    redisClient.set(`monitor:${groupId}:endTime`, endTime)(function(err, reply) { console.log('End Time Set'); startTime = null; });
  }, 5000);
}

function registerConsumer(topic, groupId, consumer) {
  console.log('registering: (topic, groupId)', topic, groupId);

  const monitor = {
    F: 0,
    E: 0,
    D: 0,
    FC: parseInt(process.env.FC) || '-',
    DC: parseInt(process.env.DC) || '-',
    groupId,
    topic,
    consumerId,
  };

  producer.on('ready', () => {
    setInterval(() => {
      const monitorCopy = JSON.parse(JSON.stringify(monitor));
      monitor.F -= monitorCopy.F;
      monitor.E -= monitorCopy.E;
      monitor.D -= monitorCopy.D;
      producer.send([{ topic: 'monitor', messages: JSON.stringify(monitorCopy) }], (err, result) => {
        if (err) { console.error('ERR:', err); }
      });
    }, 5000);
  });
  const options = {
    host: `${host}:${port}`,
    groupId,
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'latest',
  };

  const consumerGroup = new ConsumerGroup(options, topic);
  console.log('Created Consumer group==>',topic);
  consumerGroup.on('error', (err) => {
    console.log('CG ERR:', err);
  });
  consumerGroup.on('message', (msg) => {
    console.log('MESSAGE');
    if(!startTime) { setStartTime(groupId); }
    redisClient.incr(`monitor:${groupId}:count`)(() => {});
    console.log('inside consumerGroup pipeline');
    monitor.F++;
    consumer(JSON.parse(JSON.stringify(msg.value)), (err) => {
      if (err) { monitor.E++; console.log('nok:', err); return; }
      setEndTime(groupId);
      monitor.D++;
    });
  });
}

module.exports = registerConsumer;
