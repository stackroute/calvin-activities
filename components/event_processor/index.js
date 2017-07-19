const followDao = require('./dao/getCircles');
console.log('routesTopic:', routesTopic);

const topic = require('./config').kafka.topics[0];
console.log('topic:', topic);
const routesTopic = kafkaClient.routesTopic;
const mailboxDao = require('./dao/mailboxDao');
const activityDao = require('./dao/activityDao');
const adapterDao = require('./dao/adapter');
const circleDao = require('./dao/circleDao');
const flwDao = require('./dao/followDao');

const groupName = require('./config').kafka.options.groupId;

const kafkaPipeline = require('kafka-pipeline');
  
kafkaPipeline.producer.ready(function() {
  kafkaPipeline.registerConsumer(topic,groupName,(message,done)=>{
  const mailboxId= JSON.parse(message).mailboxId;
  const circleId = JSON.parse(message).circleId;
   
  let command;
  let status = JSON.parse(message).event;

  if ((status == "useronline") || (status == "addcircle")) {
      command = 'addRoute';
  } else if ((status == 'useroffline')||(status == 'removecircle')) {
      command = 'removeRoute';
  } else {
      command = 'undefined';
  }

  if ((status == "useronline") ||(status=="useroffline") ){
    followDao.getCirclesForMailbox(mailboxId, (err, result) => {
      if (err) { return { message: 'err' } ; }
      const rows = result.rows;

      rows.forEach((element) => {
        const obj = {
          circleId: element.circleid.toString(),
          mailboxId: mailboxId,
          command,
        };
        const payloads = [{ topic: routesTopic, messages: JSON.stringify(obj) }];
        kafkaPipeline.producer.send(payloads, (err, data) => {
          if (err) { return { message: 'err' }; }
          followDao.syncMailbox(mailboxId, (err, result) => {
            if(err) {console.log(err);}
          })
        });
      });

    });
  }

  if ((status == "addcircle") ||(status=="removecircle") ){
    followDao.getMailboxIdForCircle(circleId, (err, result) => {
      if (err) { return { message: 'err' }; }
      const circleMailboxId = result;
      const obj = {
        circleId: circleId,
        mailboxId: circleMailboxId,
        command,
      };
      const payloads = [{ topic: routesTopic, messages: JSON.stringify(obj),}];
      kafkaPipeline.producer.send(payloads, (err, data) => {
        if (err) { return { message: 'err' }; }
        console.log(data);
      });
    });
  }

  else if(status == "newcommunityadded"){
    const domainName = JSON.parse(message).domain;
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
    const domainName = JSON.parse(message).domain;
    if(domainName !== null){
       adapterDao.checkIfDomainExists(domainName, function(err, circle){
         const circleId = circle.circleid;
         if(err) {console.log(err); }
         if(circle != 0 && circle){
           const allMembers = JSON.parse(message).members;
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
    const domainName = JSON.parse(message).domain;
    if(domainName !== null){
       adapterDao.checkIfDomainExists(domainName, function(err, circle){
         const circleId = circle.circleid;
         if(err) {console.log(err); }
         if(circle != 0 && circle){
           const allMembers = JSON.parse(message).members;
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
    const activityType = JSON.parse(message).activitytype;
    if(activityType){
      const domain = JSON.parse(message).domain;
      adapterDao.checkIfDomainExists(domain, function(err, circle){
        if(err) {console.log(err);}
        if(circle == 0){
          adapterDao.createDomainGetCircleId(domain, function(err, circleId){
            const activity = {};
            activity.payload = JSON.parse(message);
            activity.circleId = circleId;
            const payloads = [ {topic: config.kafka.activitiesTopic, messages: JSON.stringify(activity)}];
            kafkaPipeline.producer.send(payloads, (err, data) => {
            if (err) { return { message: 'err' }; }
            activityDao.updateLastPublishedDate(circleId, function(err, res){
                if(err) {console.log(err);}
              })
            });
          })
        }
        else{
          const circleId = circle.circleid;
          const activity = {};
          activity.payload = JSON.parse(message);
          activity.circleId = circleId;
          const payloads = [ {topic: config.kafka.activitiesTopic, messages: JSON.stringify(activity)}];
          kafkaPipeline.producer.send(payloads, (err, data) => {
            if (err) { return { message: 'err' }; }
          });
        }
      })
    }
  }

  done();
  });
});