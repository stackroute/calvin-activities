const followDao = require('./dao/getCircles');

const topic = require('./config').kafka.topics[0];

const routesTopic = require('./config').kafka.routesTopic;

const activitiesTopic = require('./config').kafka.activitiesTopic;

const activityDao = require('./dao/activityDao');

const adapterDao = require('./dao/adapter');

const flwDao = require('./dao/followDao');

const uuid = require('./db').uuid;

const groupName = require('./config').kafka.options.groupId;

const kafkaPipeline = require('kafka-pipeline');

kafkaPipeline.producer.ready(() => {
  kafkaPipeline.registerConsumer(topic, groupName, (message, done) => {
    try { JSON.parse(message); } catch (ex) {
      console.log('incorrect message: ', message);
      return;
    }

    let mailboxId= JSON.parse(message).mailboxId;
    let circleId = JSON.parse(message).circleId;

    let command;
    const status = JSON.parse(message).event;

    if ((status === 'useronline') || (status === 'addcircle')) {
      command = 'addRoute';
    } else if ((status === 'useroffline')||(status === 'removecircle')) {
      command = 'removeRoute';
    } else {
      command = 'undefined';
    }

    if ((status === 'useronline') || (status === 'useroffline')) {
      if (mailboxId !== null && mailboxId !== undefined) {
        followDao.getCirclesForMailbox(mailboxId, (err, result) => {
          if (err) { console.log(err); return; }
          const rows = result.rows;

          rows.forEach((element) => {
            const obj = {
              circleId: element.circleid.toString(),
              mailboxId,
              command,
            };

            const payloads = [{ topic: routesTopic, messages: JSON.stringify(obj) }];
            kafkaPipeline.producer.send(payloads);
          });
        });
        if (status === 'useronline') {
          followDao.syncMailbox(mailboxId, (err) => {
            if (err) { console.log(err); }
          });
        }
      }
    }

    if ((status === 'addcircle') || (status === 'removecircle')) {
      followDao.getMailboxIdForCircle(circleId, (err, result) => {
        if (err) { console.log(err); return; }
        if (result && result.rows && result.rows[0]) {
          const circleMailboxId = result.rows[0].mailboxid.toString();
          const obj = {
            circleId,
            mailboxId: circleMailboxId,
            command,
          };
          const payloads = [{ topic: routesTopic, messages: JSON.stringify(obj) }];
          kafkaPipeline.producer.send(payloads);
        }
      });
    } else if (status === 'newcommunityadded') {
      const domainName = JSON.parse(message).domain;
      if (domainName !== null && domainName !== undefined) {
        adapterDao.checkIfDomainExists(domainName, (err, circle) => {
          if (circle === 0 || circle === null) {
            adapterDao.createDomain(domainName, (err1) => {
              if (err1) { console.log(err1); }
            });
          }
        });
      }
    } else if (status === 'newmembersadded') {
      const domainName = JSON.parse(message).domain;
      if (domainName !== null && domainName !== undefined) {
        adapterDao.checkIfDomainExists(domainName, (err, circle) => {
          if (err) { console.log(err); }
          if (circle !== 0 && circle) {
            circleId = circle.circleid.toString();
            const allMembers = JSON.parse(message).members;
            if (allMembers && allMembers.length > 0) {
              allMembers.forEach((element) => {
                const user = element.member;
                adapterDao.checkIfUserExists(user, (err1, userObj) => {
                  if (err1) { console.log(err1); }
                  if (userObj === 0 || userObj === null) {
                    adapterDao.createUserGetMailbox(user, (err2, userMailboxId) => {
                      flwDao.addFollow({ circleId, userMailboxId }, new Date(), (err3) => {
                        if (err3) { console.log(err3); }
                      });
                    });
                  } else {
                    mailboxId = userObj.mailboxid.toString();
                    flwDao.checkIfFollowExists({ circleId, mailboxId }, (err2, flwExists) => {
                      if (err2) { console.log(err2); }
                      if (!flwExists) {
                        flwDao.addFollow({ circleId, mailboxId }, new Date(), (err3) => {
                          if (err3) { console.log(err3); }
                        });
                      }
                    });
                  }
                });
              });
            }
          }
        });
      }
    } else if (status === 'removemembers') {
      const domainName = JSON.parse(message).domain;
      if (domainName !== null && domainName !== undefined) {
        adapterDao.checkIfDomainExists(domainName, (err, circle) => {
          circleId = circle.circleid;
          if (err) { console.log(err); }
          if (circle !== 0 && circle) {
            const allMembers = JSON.parse(message).members;
            if (allMembers && allMembers.length > 0) {
              allMembers.forEach((element) => {
                const user = element.member;
                adapterDao.checkIfUserExists(user, (err1, userObj) => {
                  if (err1) { console.log(err1); }
                  if (userObj !== 0 && userObj) {
                    mailboxId = userObj.mailboxid;
                    flwDao.checkIfFollowExists({ circleId, mailboxId }, (err2, flwExists) => {
                      if (err2) { console.log(err2); }
                      if (flwExists) {
                        flwDao.deleteFollow({ circleId, mailboxId }, (err3) => {
                          if (err3) { console.log(err3); }
                        });
                      }
                    });
                  }
                });
              });
            }
          }
        });
      }
    } else {
      const activityType = JSON.parse(message).activitytype;
      if (activityType) {
        const domain = JSON.parse(message).domain;
        if (domain !== null && domain !== undefined) {
          adapterDao.checkIfDomainExists(domain, (err, circle) => {
            if (err) { console.log(err); }
            if (circle === 0 || circle === null) {
              adapterDao.createDomainGetCircleId(domain, (err1, domainCircleId) => {
                const activity = {};
                activity.payload = JSON.parse(message);
                activity.payload.id = uuid().toString();
                activity.payload.createdAt = new Date();
                activity.circleId = domainCircleId;
                const payloads = [{ topic: activitiesTopic, messages: JSON.stringify(activity) }];
                kafkaPipeline.producer.send(payloads);
                activityDao.updateLastPublishedDate(domainCircleId, (err2) => {
                  if (err2) { console.log(err2); }
                });
              });
            } else {
              circleId = circle.circleid;
              const activity = {};
              activity.payload = JSON.parse(message);
              activity.payload.id = uuid().toString();
              activity.payload.createdAt = new Date();
              activity.circleId = circleId;
              const payloads = [{ topic: activitiesTopic, messages: JSON.stringify(activity) }];
              kafkaPipeline.producer.send(payloads);
            }
          });
        }
      }
    }

    done();
  });
});
