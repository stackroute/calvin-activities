
const redisClient = require('./client/redisclient').client;

const topic =require('./config').kafka.topics[0];

const kafkaClient = require('./client/kafkaclient');

const consumer = kafkaClient.consumer;

const producer = kafkaClient.producer;

const thisConsumerId = kafkaClient.thisConsumerId;

let startTimeAlreadySet = false;

function setStartTime() {
  startTimeAlreadySet = true;
  redisClient.get('startTime')((err, reply) => {
    if (!reply) {
      console.log('Reply Not Set');
      return redisClient.set('startTime', (new Date()).getTime());
    }
    return 0;
  })((err, response) => {
    if (err) { console.log(err); } else { console.log('Reply Already Set'); }
  });
}

let setEndTimeTimeout = null;

function setEndTime(endTime) {
  redisClient.set('endTime', (new Date()).getTime())((err, response) => {
    if (err) { console.log(err); } else { console.log('EndTime Set'); }
  });
}

consumer.on('message', (message) => {
  console.log(message);
  if (!startTimeAlreadySet) {
    setStartTime();
  }

  const activity = JSON.parse(message.value);
  const circleId = activity.circleId;
  let followers;
  redisClient.incr(`${thisConsumerId}:count`)((err, result) => { });
  redisClient.smembers(`${topic}:${circleId}`)((err, result) => {
    followers = result;
    const arr = [];
    followers.forEach((data) => {
      const newActivity = activity;
      newActivity.mailboxId = data;
      arr.push({ topic: `${topic}D`, messages: [JSON.stringify(newActivity)] });
    });
    producer.send(arr, (error, data) => {
      if (setEndTimeTimeout) { clearTimeout(setEndTimeTimeout); }
      setEndTimeTimeout = setTimeout(setEndTime.bind(new Date()), 5000);
    });
  });
});
