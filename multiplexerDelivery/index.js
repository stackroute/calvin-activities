/* eslint no-unused-expressions:0 */

const kafkaClient = require('../client/kafkaclient');
const redisClient = require('../client/redisclient');
const activityDao = require('../dao').activity;
const mailboxDAO = require('../dao').mailbox;

kafkaClient.consumer.on('message', (message) => {
  const receiver =JSON.parse(message.value).mailboxId;
  const newActivity = {
    message: JSON.parse(message.value).payload,

    timestamp: new Date(),
  };

  mailboxDAO.checkIfMailboxExists(receiver, (data, mailboxExists) => {
    if (!mailboxExists) { ({ message: 'Mailbox Id does not exists' }); return; }
    activityDao.publishToMailbox(receiver, newActivity, (error1, data1) => {
      if (error1) { ({ message: `${error1}` }); return; }

      redisClient.add(receiver, newActivity.message, (err, data2) => {
        if (error1) { ({ message: `${error1}` }); }
      });
    });
  });
});


kafkaClient.consumer.on('error', err => ({ message: `${err}` }));
