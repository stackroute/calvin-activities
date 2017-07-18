const kafkaClient = require('./client/kafkaclient');

const consumer = kafkaClient.consumer;

const producer = kafkaClient.producer;

const followDao = require('./dao/getCircles');

const mailboxDao = require('./dao/mailboxDao');
const activityDao = require('./dao/activityDao');

const routesTopic = kafkaClient.routesTopic;

const adapterDao = require('./dao/adapter');
const circleDao = require('./dao/circleDao');
const flwDao = require('./dao/followDao');

consumer.on('message', (message) => {

  console.log(message);
  const mailId = JSON.parse(message.value).mailboxId;
  const circleId = JSON.parse(message.value).circleId;

  let command;
  let status = JSON.parse(message.value).event;

  if ((status == "useronline") || (status == "addcircle")) {
    command = 'addRoute';
  } else if ((status == 'useroffline') || (status == 'removecircle')) {
    command = 'removeRoute';
  } else {
    command = 'undefined';
  }
  if ((status == "useronline") || (status == "useroffline")) {
    followDao.getCirclesForMailbox(mailId, (err, result) => {
      if (err) {
        return {
          message: 'err'
        };
      }
      const rows = result.rows;

      rows.forEach((element) => {
        const obj = {
          circleId: element.circleid.toString(),
          mailboxId: mailId,
          command,
        };
        const payloads = [{
          topic: routesTopic,
          messages: JSON.stringify(obj),
          partition: 0
        }];
        producer.send(payloads, (err, data) => {
          if (err) {
            return {
              message: 'err'
            };
          }
          followDao.syncMailbox(mailId, (err, result) => {
            if (err) {
              console.log(err);
            }
          })
        });
        producer.on('error', err => (console.log({
          message: 'err'
        })));
      });

    });
  }

  else if ((status == "addcircle") || (status == "removecircle")) {
    followDao.getMailboxIdForCircle(circleId, (err, result) => {
      if (err) {
        return {
          message: 'err'
        };
      }
      const circleMailboxId = result;
      const obj = {
        circleId: circleId,
        mailboxId: circleMailboxId,
        command,
      };

      const payloads = [{
        topic: routesTopic,
        messages: JSON.stringify(obj),
        partition: 0
      }];
      producer.send(payloads, (err, data) => {
        if (err) {
          return {
            message: 'err'
          };
        }
        console.log(data);
      });
      producer.on('error', err => ({
        message: 'err'
      }));
    });
  }

  else if(status == "newcommunityadded"){
    const domainName = JSON.parse(message.value).domain;
    if(domainName !== null){
       adapterDao.checkIfDomainExists(domainName, function(err, circle){
         if(circle == 0){
           adapterDao.createDomain(domainName, function(err, data){
             if(err) {console.log(err);}
           })
         }
       })
    }
  }

  else if(status == "newmembersadded"){
    const domainName = JSON.parse(message.value).domain;
    if(domainName !== null){
       adapterDao.checkIfDomainExists(domainName, function(err, circle){
         const circleId = circle.circleid;
         if(err) {console.log(err); }
         if(circle != 0 && circle){
           const allMembers = JSON.parse(message.value).members;
            if(allMembers && allMembers.length > 0){
              allMembers.forEach(element => {
                let user = element.member;
                adapterDao.checkIfUserExists(user, function(err, userObj){
                  if(err) { console.log(err);}
                  if(userObj == 0){
                    adapterDao.createUserGetMailbox(user, function(err, mailboxId){
                      flwDao.addFollow({circleId, mailboxId}, function(err, result){
                        if(err) {console.log(err);}
                      })
                    })
                  }
                  else{
                      let mailboxId = userObj.mailboxid;
                      flwDao.checkIfFollowExists({circleId, mailboxId}, function(err, flwExists){
                       if(err) {console.log(err);}
                       if(!flwExists){
                         flwDao.addFollow({circleId, mailboxId}, function(err, result){
                           if(err) {console.log(err);}
                         })
                       }
                     })
                  }
                })
              });
            }
         }
       })
    }
  }

  else if(status == "removemembers"){
    const domainName = JSON.parse(message.value).domain;
    if(domainName !== null){
       adapterDao.checkIfDomainExists(domainName, function(err, circle){
         const circleId = circle.circleid;
         if(err) {console.log(err); }
         if(circle != 0 && circle){
           const allMembers = JSON.parse(message.value).members;
            if(allMembers && allMembers.length > 0){
              allMembers.forEach(element => {
                let user = element.member;
                adapterDao.checkIfUserExists(user, function(err, userObj){
                  if(err) { console.log(err);}
                  if(userObj != 0 && userObj){
                     let mailboxId = userObj.mailboxid;
                      flwDao.checkIfFollowExists({circleId, mailboxId}, function(err, flwExists){
                       if(err) {console.log(err);}
                       if(flwExists){
                         flwDao.deleteFollow({circleId, mailboxId}, function(err, result){
                           if(err) {console.log(err);}
                         })
                       }
                     })
                  }
                })
              });
            }
         }
       })
    }
  }

  else{
    const activityType = JSON.parse(message.value).activitytype;
    if(activityType){
      const domain = JSON.parse(message.value).domain;
      adapterDao.checkIfDomainExists(domain, function(err, circle){
        if(err) {console.log(err);}
        if(circle == 0){
          adapterDao.createDomainGetCircleId(domain, function(err, circleId){
            const activity = {};
            activity.payload = JSON.parse(message.value);
            activity.circleId = circleId;
            producer.send([ {topic: config.kafka.activitiesTopic, messages: JSON.stringify(activity)}], (err, data) => {
              if (err) { console.log(err); }
              activityDao.updateLastPublishedDate(circleId, function(err, res){
                if(err) {console.log(err);}
              })
            });
          })
        }
        else{
          const circleId = circle.circleid;
          const activity = {};
          activity.payload = JSON.parse(message.value);
           activity.circleId = circleId;
           producer.send([ {topic: config.kafka.activitiesTopic, messages: JSON.stringify(activity)}], (err, data) => {
             if (err) { console.log(err); }
             activityDao.updateLastPublishedDate(circleId, function(err, res){
               if(err) {console.log(err);}
             })
           });
        }
      })

    }
  }
  


const domain = JSON.parse(message.value).domain;
  if (status == "newmemberadded") {
    adapterDao.checkIfDomainExists(domain, (error, doesDomainExists) => {
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesDomainExists) {
      res.status(404).json({ message: 'Domain does not exist' });
      return;
    }
    mailboxDao.createMailbox((err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result)
      }
    })
  });
}
});