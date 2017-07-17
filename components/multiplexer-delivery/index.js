/* eslint no-unused-expressions:0 */

const kafkaClient = require('./client/kafkaclient');
const redisClient = require('./client/redisclient').client;
const activityDAO = require('./dao/activity');
const mailboxDAO = require('./dao/mailbox');
const topic =require('./config').kafka.topics[0];

const consumer = kafkaClient.consumer;

let startTimeAlreadySet = false;

function setStartTime() {
  startTimeAlreadySet = true;
  redisClient.get('startTime')((err, reply) => {
    if (!reply) {
      console.log('Reply Not Set');
      return redisClient.set('startTime', (new Date()).getTime());
    }
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
  if (!startTimeAlreadySet) {
    setStartTime();
  }

  const receiver = JSON.parse(message.value).mailboxId;
  const newActivity = {
    payload: JSON.parse(message.value).payload,
    timestamp: new Date(),
  };

  mailboxDAO.checkIfMailboxExists(receiver, (err, mailboxExists) => {
    if (err) { console.log({ message: `${err}` }); return; }
    redisClient.publish(receiver, JSON.stringify(newActivity));
    activityDAO.publishToMailbox(receiver, newActivity, (error, data) => {
      if (error) { console.log({ message: `${error}` }); } else {
        if (setEndTimeTimeout) { clearTimeout(setEndTimeTimeout); }
        setEndTimeTimeout = setTimeout(setEndTime.bind(new Date()), 5000);
      }
    });
  });
});

consumer.on('error', err => ({ message: `${err}` }));
