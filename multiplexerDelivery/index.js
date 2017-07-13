/* eslint no-unused-expressions:0 */

const activityDao = require('../dao').activity;
const mailboxDAO = require('../dao').mailbox;
const redisClient = require('../client/redisclient');
const library = require('../library');
const topicName = 'multiplex';
const consumerGroupName = 'consumerGroupName'
const config = require('../config').kafka;


console.log('multiplexer started........');
library.registerConsumer(config, topicName, consumerGroupName, onMessage);
function onMessage( msg){
  try{
    const message = JSON.parse(msg);
    if(message.mailboxId && message.payload){
      const receiver = message.mailboxId;
      const newActivity = {
        payload: message.payload,
        timestamp: new Date(),
      };

      mailboxDAO.checkIfMailboxExists(receiver, (data, mailboxExists) => {
        if (!mailboxExists) { console.log({ message: 'Mailbox Id does not exists' }); return; }
        activityDao.publishToMailbox(receiver, newActivity, (error1, data1) => {
          console.log('inside publish'+data1);
          if (error1) { console.log({ message: `${error1}` }); return; }
          redisClient.add(receiver, newActivity, (err, data2) => {
            if (err) { console.log({ message: `${err}` }); }
          });
        });
      });
    }
  }
  catch(err){
    console.log({ message: `${err}` });
  }
}

