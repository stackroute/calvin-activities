
const redisClient = require('../client/redisclient').client;

const topic =require('../config').kafka.topics.topic;

console.log(`topic===>${topic}`);

const kafkaClient = require('../client/kafkaclient');

const consumer = kafkaClient.consumer;

const producer = kafkaClient.producer;


function multiplexer(callback) {
  const arr = [];
  consumer.on('message', (message) => {
  // console.log(message);
    const activity = JSON.parse(message.value);
    const circleId = activity.circleId;
    // console.log(`circleId${circleId}`);
    let followers;
    redisClient.incr(`${topic}:count`);
    // console.log(`topic${topic}`);
    //  console.log(`circleId${circleId}`);
    redisClient.smembers(`${topic}:C1`)((err, result) => {
      followers = result;
      // console.log('followers'+result);
      followers.forEach((data) => {
        // console.log('inside followers');
        const newActivity = activity;
        newActivity.mailboxId = data;
        arr.push({ topic: `${topic}D`, messages: [JSON.stringify(newActivity)] });
        // console.log('arr'+arr);
      });
      producer.send(arr, (error, data) => {

      });
    });
  });
  callback(null, arr);
}

module.exports= {
  multiplexer,
};
