const L1RCacheNamespace = require('./config').redis.namespace;

const redis = require('./client/redisclient').client;

const kafkaClient = require('./client/kafkaclient');

const topic =require('./config').kafka.topics[0];

const groupName = require('./config').kafka.options.groupId;

const kafkaPipeline = require('kafka-pipeline');

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

  kafkaPipeline.registerConsumer(topic,groupName,(message, done)=> {
    if (!startTimeAlreadySet) {
      setStartTime();
    }
    redis.incr(`${topic}:count`)((err, reply) => {
      const key = `${L1RCacheNamespace}:${JSON.parse(message.value).circleId}`;
      redis.info('server')(function (error, res) {
        return this.select(0);
      })(function (error, res) {
        return this.smembers(key);
      })((error, res) => {
        const payloads =[];
        res.forEach((element) => {
          payloads.push({ topic: element, messages: [message.value] });
        });

        kafkaPipeline.producer.send(payloads, (err, data) => {
          if (err) { throw err; }
          console.log(data);
          if (setEndTimeTimeout) { clearTimeout(setEndTimeTimeout); }
          setEndTimeTimeout = setTimeout(setEndTime.bind(new Date()), 5000);
        });
      });
    });
    done();
  });
});
