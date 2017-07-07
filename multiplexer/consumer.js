
// const redisClient = require('../client/redisclient').client;

const kafka = require('kafka-node');

const Consumer = kafka.Consumer;

const client = new kafka.Client();

const Producer = kafka.Producer;

const producer = new Producer(client);

const redis = require('thunk-redis');

const redisClient = redis.createClient();

const consumer = new Consumer(
  client,
  [
    { topic: 'M2', partition: 0, offset: 2 },
  ],
  {
    autoCommit: false,
    fromOffset: true,
  },
);

consumer.on('message', (message) => {
  const activity = JSON.parse(message.value);
  const circleId = activity.circleId;
  let followers;
  redisClient.smembers(`${message.topic}:${circleId}`)((err, result) => {
    followers = result;
    const arr = [];
    followers.forEach((data) => {
      const newActivity = {
        payload: JSON.parse(message.value),
        mailboxId: data,
      };
      arr.push({ topic: 'M1D', messages: [JSON.stringify(newActivity)] });
    });
    producer.send(arr, (error, data) => {
    });
  });
});

