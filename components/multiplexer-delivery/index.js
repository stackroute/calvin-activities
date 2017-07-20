const redisClient = require('./client/redisclient').client;

const kafka = require('kafka-node');

const { ConsumerGroup, Client, HighLevelProducer } = kafka;
const config =require('./config').redis;

const { host, port } = require('./config').kafka;
const client = new Client(`${host}:${port}`);
const producer = new HighLevelProducer(client);

const redis = require('redis');
console.log(`${config.host}:${config.port}`);
const redisPublisher = redis.createClient({host:config.host, port: config.port});

const topic =require('./config').kafka.topics[0];

const groupName = require('./config').kafka.options.groupId;

const id = require('./config').kafka.options.id;

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
let arr = [];
function setEndTime(endTime) {
  redisClient.set('endTime', (new Date()).getTime())((err, response) => {
    if (err) { console.log(err); } else { console.log('EndTime Set'); }
  });
}

  const result = {
    "CG":groupName,
    "CID": id,
    "CDR": 0,
  };
kafkaPipeline.registerConsumer(topic, groupName, (message, done) => {
      setInterval(function() {
        // console.log('inside setInterval');
      const resultCopy = JSON.parse(JSON.stringify(result));
      result.CDR -= resultCopy.CDR;
  
      producer.send([{ topic: 'monitor', messages: JSON.stringify(resultCopy) }], (err, result) => {
        if (err) { console.error('ERR:', err); }
      });
  
    }, 5000);
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
     result.CDR++;
     console.log('result==>',result);      
        if (error) { console.log({ message: `${error}` }); done(err); return; } else {
        if (setEndTimeTimeout) { clearTimeout(setEndTimeTimeout); }
        setEndTimeTimeout = setTimeout(setEndTime.bind(new Date()), 5000);
        done();
      }
    });
  });

});

