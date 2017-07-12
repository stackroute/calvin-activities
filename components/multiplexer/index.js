
const redisClient = require('../client/redisclient').client;

const topic =require('../config').kafka.topics.topic;

const kafkaClient = require('../client/kafkaclient');

const consumer = kafkaClient.consumer;

const producer = kafkaClient.producer;

const redisClient = require('./client/redisclient');

function setStartTimeIfUnset() {
  redisClient.get('startTime', (err, reply) => {
    if(err) { process.exit(-1); }
    if(!reply) {
      redisClient.set('startTime', new Date());
    }
  });
}

consumer.on('message', (message) => {
  console.log(message);
  const activity = JSON.parse(message.value);
  const circleId = activity.circleId;
  let followers;
  redisClient.incr(`${topic}:count`);
  redisClient.smembers(`${topic}:${circleId}`)((err, result) => {
    followers = result;
    const arr = [];
    followers.forEach((data) => {
      const newActivity = activity;
      newActivity.mailboxId = data;
      arr.push({ topic: `${topic}D`, messages: [JSON.stringify(newActivity)] });
    });
    producer.send(arr, (error, data) => {
      redisClient.set('endTime', new Date());
    });
  });
});
