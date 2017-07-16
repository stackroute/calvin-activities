const redisClient = require('../client/redisclient').client;

const kafkaClient = require('../client/kafkaclient');

const topic =require('../config').kafka.topics[0];

const groupName = require('../config').kafka.options.groupId;

const registerConsumer = require('../components/lib/kafka-pipeline/Library/register-consumer');

const producer = kafkaClient.producer;

function multiplexer(callback) {
  const arr = [];

  registerConsumer(topic, groupName, (message, done) => {
      console.log("start");
    const activity = JSON.parse(message.value);
    const circleId = activity.circleId;
    // console.log(`circleId${circleId}`);
    let followers;
    redisClient.incr(`${topic}:count`);
    redisClient.smembers(`${topic}:C1`)((err, result) => {
      followers = result;
      followers.forEach((data) => {
        const newActivity = activity;
        newActivity.mailboxId = data;
        arr.push({ topic: `${topic}D`, messages: [JSON.stringify(newActivity)] });
        
      });
      producer.send(arr, (error, data) => {
        if(error) {console.log(`${error}`); return ; }
        console.log(data);
      });
    });
  });
  callback(null, err);
}

module.exports= {
  multiplexer,
};
