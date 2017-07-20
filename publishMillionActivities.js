#!/usr/bin/node

const winston = require('winston');
const circleDAO = require('./dao').circle;
const mailboxDAO = require('./dao').mailbox;
const followDAO = require('./dao').follow;
const activityDAO = require('./dao').activity;
const routesManagerService = require('./services/routes');

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
    if (err) { throw err; }
    winston.log(result);
    circles.push(result.id);
  });
}

for (i = 0; i< 1000; i += 1) {
  mailboxDAO.createMailbox((err, result) => {
    if (err) { throw err; }
    winston.log(result);
    mailboxes.push(result.id);
  });
}

setTimeout(() => {
  circles.forEach((circleId) => {
    mailboxes.forEach((mailboxId) => {
      followDAO.addFollow({ circleId, mailboxId }, (err, result) => {
        if (err) { throw err; }
        winston.log(result);
        routesManagerService.addRoute(circleId, mailboxId, (err1, result1) => {
          winston.log('added route');
          if (err) { throw err; }
          winston.log(result1);
        });
      });
    });
  });
}, 10000);


/*setTimeout(() => {
  winston.log(`Started pushing messages to activities topic..${new Date().getTime()}`);
  circles.forEach((circleId) => {
    for (i = 0; i< 100; i += 1) {
      activity.messageNumber = i;
      activity.cId = circleId;
      activityDAO.createPublishActivity(circleId, activity, (err, result) => {
        if (err) { throw err; }
        winston.log(result);
      });
    }
  });
  winston.log(`Stopped pushing messages to activities topic..${new Date().getTime()}`);
}, 20000);*/
