const topic =require('./config').kafka.topics[0];

const groupName = require('./config').kafka.options.groupId;

const kafkaPipeline = require('kafka-pipeline');

const L1RCacheNamespace = require('./config').redis.namespace;

const redis = require('./client/redisclient').client;

let startTimeAlreadySet = false;

function setStartTime() {
  startTimeAlreadySet = true;
  redis.get('startTime')((err, reply) => {
    if (err) { console.log(err); return; }
    return redis.set('startTime', (new Date()).getTime());
  })((err, response) => {
    if (err) { console.log(err); return; }
    console.log('Reply Already Set');
  });
}

let setEndTimeTimeout = null;

function setEndTime(endTime) {
  redis.set('endTime', (new Date()).getTime())((err, response) => {
    if (err) { console.log(err); return; }
    console.log('EndTime Set');
  });
}

kafkaPipeline.producer.ready(function() {
  console.log('topic:', topic);
  kafkaPipeline.registerConsumer(topic,groupName,(message, done)=> {
    console.log(message);
    if (!startTimeAlreadySet) {
      setStartTime();
    }
    redis.incr(`${topic}:count`)((err, reply) => {
      if (err) { done(err); return; }
      const key = `${L1RCacheNamespace}:${JSON.parse(message).circleId}`;
      redis.info('server')(function (error, res) {
        if(error) { done(error); return; }
        return this.select(0);
      })(function (error, res) {
        if(error) { done(error); return; }
        return this.smembers(key);
      })((error, res) => {
        if(error) { done(error); return; }
        const payloads =[];
        res.forEach((element) => {
          payloads.push({ topic: element, messages: [message] });
        });
        kafkaPipeline.producer.send(payloads);
        done();
      });
    });
  });
});
