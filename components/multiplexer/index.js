
const redisClient = require('./client/redisclient').client;

const topic =require('./config').kafka.topics.topic;

const kafkaClient = require('./client/kafkaclient');

const consumer = kafkaClient.consumer;

const producer = kafkaClient.producer;

let startTimeAlreadySet = false;

function setStartTime() {
  startTimeAlreadySet = true;
  redisClient.get('startTime', (err, reply) => {
    if(!reply) {
      console.log('Reply Not Set');
      redisClient.set('startTime', (new Date()).getTime());
    } else { console.log('Reply Already Set'); }
  });
}

let setEndTimeTimeout = null;

function setEndTime(endTime) {
  redisClient.set('endTime', (new Date()).getTime());
}

console.log('config:', config);

consumer.on('message', (message) => {
  if(!startTimeAlreadySet) {
    setStartTime();
  }

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
      if(setEndTimeTimeout) { clearTimeout(setEndTimeTimeout); }
      setEndTimeTimeout = setTimeout(setEndTime.bind(new Date()), 5000);
    });
  });
});
