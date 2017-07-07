
const redisClient = require('../client/redisclient').client;

const topic =require('../config').kafka.topics.topic;

const kafkaClient = require('../client/kafkaclient');

const consumer = kafkaClient.consumer;

const producer = kafkaClient.producer;

consumer.on('message', (message) => {
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
    });
  });
});

