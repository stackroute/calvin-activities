const redisClient = require('./client/redisclient').client;
const config =require('./config').redis;

const redis = require('redis');
console.log(`${config.host}:${config.port}`);
const redisPublisher = redis.createClient({host:config.host, port: config.port});

const topic =require('./config').kafka.topics[0];

const groupName = require('./config').kafka.options.groupId;

const kafkaPipeline = require('kafka-pipeline');

const activityDAO = require('./dao/activity');
const mailboxDAO = require('./dao/mailbox');

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

kafkaPipeline.registerConsumer(topic, groupName, (message, done) => {
  console.log(message);
  if (!startTimeAlreadySet) {
    setStartTime();
  }

  const receiver = JSON.parse(message).mailboxId;
  const newActivity = {
    payload: JSON.parse(message).payload,
    timestamp: new Date(),
  };

  mailboxDAO.checkIfMailboxExists(receiver, (err, mailboxExists) => {
    if (err) { console.log({ message: `${err}` }); done(err); return; }
    redisPublisher.publish(receiver, JSON.stringify(newActivity));
    activityDAO.publishToMailbox(receiver, newActivity, (error, data) => {
      if (error) { console.log({ message: `${error}` }); done(err); return; } else {
        if (setEndTimeTimeout) { clearTimeout(setEndTimeTimeout); }
        setEndTimeTimeout = setTimeout(setEndTime.bind(new Date()), 5000);
        done();
      }
    });
  });
});


/*const kafkaClient = require('./client/kafkaclient');
const redisClient = require('./client/redisclient').client;
const activityDAO = require('./dao/activity');
const mailboxDAO = require('./dao/mailbox');
const topic =require('./config').kafka.topics[0];

const groupName = require('./config').kafka.options.groupId;

const kafkaPipeline = require('kafka-pipeline');

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

kafkaPipeline.registerConsumer(topic, groupName, (message, done) => {
  console.log(message);
  if (!startTimeAlreadySet) {
    setStartTime();
  }

  const receiver = JSON.parse(message).mailboxId;
  const newActivity = {
    payload: JSON.parse(message).payload,
    timestamp: new Date(),
  };

  mailboxDAO.checkIfMailboxExists(receiver, (err, mailboxExists) => {
    if (err) { console.log({ message: `${err}` }); done(err); return; }
    redisClient.publish(receiver, JSON.stringify(newActivity));
    activityDAO.publishToMailbox(receiver, newActivity, (error, data) => {
      if (error) { console.log({ message: `${error}` }); done(err); return; } else {
        if (setEndTimeTimeout) { clearTimeout(setEndTimeTimeout); }
        setEndTimeTimeout = setTimeout(setEndTime.bind(new Date()), 5000);
        done();
      }
    });
  });
});*/
