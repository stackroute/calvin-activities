const circleDAO = require('./dao').circle;
const mailboxDAO = require('./dao').mailbox;
const followDAO = require('./dao').follow;
const activityDAO = require('./dao').activity;

const circles = [];
const mailboxes = [];
const activity = {
  type: 'Activity',
  name: 'Sallie uploaded a document',
  messageNumber: 0,
};
let i;

for (i = 0; i < 100; i += 1) {
  circleDAO.createCircle((err, result) => {
    console.log(err);
    console.log(result);
    circles.push(result.id);
  });
}

for (i = 0; i< 100; i += 1) {
  mailboxDAO.createMailbox((err, result) => {
    console.log(err);
    console.log(result);
    mailboxes.push(result.id);
  });
}

setTimeout(() => { circles.forEach((circleId) => {
  mailboxes.forEach((mailboxId) => {
    followDAO.addFollow({ circleId, mailboxId }, (err, result) => {
      console.log(err);
      console.log(result);
    });
  });
}); }, 10000);

setTimeout(() => { 
  console.log(`Started pushing messages to activities topic..${new Date().getTime()}`);
  circles.forEach((circleId) => {
    for (i = 0; i< 100; i += 1) {
      activity.messageNumber = i;
      activity.cId = circleId;
      activityDAO.createPublishActivity(circleId, activity, (err, result) => {
        console.log(err);
        console.log(result);
      });
    }
  });
  console.log(`Stopped pushing messages to activities topic..${new Date().getTime()}`);
}, 20000);
