const topic =require('./config').kafka.topics[0];

const groupName = require('./config').kafka.options.groupId;

const kafkaPipeline = require('kafka-pipeline');

const L1RCacheNamespace = require('./config').redis.namespace;

const redis = require('./client/redisclient').client;

let startTimeAlreadySet = false;

function setStartTime() {
  startTimeAlreadySet = true;
  redis.get('startTime')((err) => {
    if (err) { console.log(err); return; }
    redis.set('startTime', (new Date()).getTime());
  })((err) => {
    if (err) { console.log(err); }
  });
}

kafkaPipeline.producer.ready(() => {
  kafkaPipeline.registerConsumer(topic, groupName, (message, done) => {
    if (!startTimeAlreadySet) {
      setStartTime();
    }
    redis.incr(`${topic}:count`)((err) => {
      if (err) { done(err); return; }
      const key = `${L1RCacheNamespace}:${JSON.parse(message).circleId}`;
      redis.smembers(key)((error, res) => {
        if (error) { done(error); return; }
        const payloads = [];
        res.forEach((element) => {
          payloads.push({ topic: element, messages: [message] });
        });

        kafkaPipeline.producer.send(payloads);
        done();
      });
    });
  });
});
