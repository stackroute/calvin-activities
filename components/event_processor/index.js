const followDao = require('./dao/getCircles');

const routesTopic = require('./config').kafka.routesTopic;

console.log('routesTopic:', routesTopic);

const topic = require('./config').kafka.topics[0];
console.log('topic:', topic);

const groupName = require('./config').kafka.options.groupId;

const kafkaPipeline = require('kafka-pipeline');
  
  kafkaPipeline.producer.ready(function() {
    kafkaPipeline.registerConsumer(topic,groupName,(message,done)=>{
    const mailboxId= JSON.parse(message.value).mailboxId;
    const circleId = JSON.parse(message.value).circleId;
   
    let command;
    let status = JSON.parse(message.value).event;

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
        const payloads = [{ topic: routesTopic, messages: JSON.stringify(obj), partition: 0 }];
        kafkaPipeline.producer.send(payloads, (err, data) => {
          if (err) { return { message: 'err' }; }
          followDao.syncMailbox(mailboxIdmailboxId, (err, result) => {
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

      const payloads = [{ topic: routesTopic, messages: JSON.stringify(obj), partition: 0 }];
      kafkaPipeline.producer.send(payloads, (err, data) => {
        if (err) { return { message: 'err' }; }
        console.log(data);
      });
    });
   }
  done();
  });
});
