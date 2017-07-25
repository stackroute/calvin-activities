const redisClient = require('./client/redisclient').client;

const topic =require('./config').kafka.topics[0];

const groupName = require('./config').kafka.options.groupId;

const kafkaPipeline = require('kafka-pipeline');

kafkaPipeline.producer.ready(function() {
  kafkaPipeline.registerConsumer(topic, groupName, (message, done) => {
    console.log(message);
    const activity = JSON.parse(message);
    const circleId = activity.circleId;
    let followers;
    redisClient.smembers(`${topic}:${circleId}`)((err, result) => {
      if(err) { done(err); return; }
      followers = result;
      const arr = [];
      followers.forEach((data) => {
        const newActivity = activity;
        newActivity.mailboxId = data;
        arr.push({ topic: `${topic}D`, messages: [JSON.stringify(newActivity)] });
      });
      kafkaPipeline.producer.send(arr);
      console.log('OOKK');
      done();
    });
  });
});
