/* eslint no-unused-expressions:0 */

const kafkaClient = require('../client/kafkaclient');

// const redisClient = require('../client/redisclient');
const publisher = require("redis").createClient([{host:'172.23.238.134', port:'6379'}]);

const topic =require('../config').kafka.topics.topic;

const activityDao = require('../dao').activity;
const mailboxDAO = require('../dao').mailbox;

const consumer = kafkaClient.consumer;
consumer.on('message', (message) => {
  console.log(message);
  const receiver =JSON.parse(message.value).mailboxId;
  const newActivity = {
    payload: JSON.parse(message.value).payload,

    timestamp: new Date(),
  };

  mailboxDAO.checkIfMailboxExists(receiver, (data, mailboxExists) => {
    if (!mailboxExists) { ({ message: 'Mailbox Id does not exists' }); return; }
    activityDao.publishToMailbox(receiver, newActivity, (error1, data1) => {
      if (error1) { ({ message: `${error1}` }); }
      publisher.publish(receiver, JSON.stringify(newActivity));
    });
  });
});

consumer.on('error', err => ({ message: `${err}` }));