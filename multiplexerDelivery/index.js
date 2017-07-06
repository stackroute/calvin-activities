//const config = require('./config.json');

const kafkaClient = require('../client/kafkaclient');
const redisClient = require('../client/redisclient');
const kafka = require('kafka-node');
const activityDao = require('../dao').activity;
const mailboxDAO = require('../dao').mailbox;
//const redis = require('../services/multiplexer_delivery');



kafkaClient.consumer.on('message', (message) => {
  const receiver ='0b8ce7ad-8cac-4f59-92bc-e373330fe146';
  const newActivity = {
    message: message.value,
    timestamp: new Date(),
  };

  mailboxDAO.checkIfMailboxExists(receiver, (data, mailboxExists) => {
    if (!mailboxExists) { console.log('Mailbox Id does not exists'); return; }
    activityDao.publishToMailbox(receiver, newActivity, (error1, data1) => {
      if (error1) { console.log({ message: `${error1}` }); return; }
      console.log(data1);
      redisClient.add(receiver, newActivity.message, (err, data2) => {
        if (error1) { console.log({ message: `${error1}` }); return; }
        console.log(data2);
      });
    });
  });
});


kafkaClient.consumer.on('error', (err) => { console.log(err); });
