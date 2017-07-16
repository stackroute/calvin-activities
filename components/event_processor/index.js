const kafkaClient = require('./client/kafkaclient');

const consumer = kafkaClient.consumer;

const producer = kafkaClient.producer;

const followDao = require('./dao/getCircles');

const routesTopic =kafkaClient.routesTopic;

const topic =require('./config').kafka.topics[0];

const groupName = require('./config').kafka.options.groupId;

const registerConsumer = require('.././lib/kafka-pipeline/Library/register-consumer');


registerConsumer(topic, groupName, (message, done) => {
//todo

  const mailboxId= JSON.parse(message.value).mailboxId;
   const circleId = JSON.parse(message.value).circleId;
 
  let command;

  let status = JSON.parse(message.value).event;

  if ((status == "useronline")||(status == "addCircle")) {
    command = 'addRoute';
  } else if ((status == 'useroffline')||(status == 'removeCircle')) {
    command = 'removeRoute';
  } else {
    command = 'undefined';
  }
if ((status == "useronline") ||(status=="useroffline") ){
  followDao.getCirclesForMailbox(mailboxId, (err, result) => {
    if (err) { return { message: 'err' }; }
   
    const rows = result.rows;

    rows.forEach((element) => {
      const obj = {
        circleid: element.circleid.toString(),
        mailboxid: mailboxId,
        command,
      };
      const payloads = [{ topic: routesTopic, messages: JSON.stringify(obj), partition: 0 }];
      producer.send(payloads, (err, data) => {
        if (err) { return { message: 'err' }; }
        console.log(data);
      });
      producer.on('error', err => ({ message: 'err' }));
    });

  });
}
if ((status == "addCircle") ||(status=="removeCircle") ){
  followDao.getMailboxIdForCircle(circleId, (err, result) => {
    if (err) { return { message: 'err' }; }
    const circleMailboxId = result;
  
      const obj = {
        circleMailboxId: circleMailboxId,
       command,
      };
      const payloads = [{ topic: routes_Topic, messages: JSON.stringify(obj), partition: 0 }];
      producer.send(payloads, (err, data) => {
        if (err) { return { message: 'err' }; }
         console.log("data");
      });
      producer.on('error', err => ({ message: 'err' }));
    });
}

done();
});

// consumer.on('message', (message) => {

//   const mailboxId= JSON.parse(message.value).mailboxId;
//    const circleId = JSON.parse(message.value).circleId;
 
//   let command;

//   let status = JSON.parse(message.value).event;

//   if ((status == "useronline")||(status == "addCircle")) {
//     command = 'addRoute';
//   } else if ((status == 'useroffline')||(status == 'removeCircle')) {
//     command = 'removeRoute';
//   } else {
//     command = 'undefined';
//   }
// if ((status == "useronline") ||(status=="useroffline") ){
//   followDao.getCirclesForMailbox(mailboxId, (err, result) => {
//     if (err) { return { message: 'err' }; }
   
//     const rows = result.rows;

//     rows.forEach((element) => {
//       const obj = {
//         circleid: element.circleid.toString(),
//         mailboxid: mailboxId,
//         command,
//       };
//       const payloads = [{ topic: routesTopic, messages: JSON.stringify(obj), partition: 0 }];
//       producer.send(payloads, (err, data) => {
//         if (err) { return { message: 'err' }; }
//         console.log(data);
//       });
//       producer.on('error', err => ({ message: 'err' }));
//     });

//   });
// }

// if ((status == "addCircle") ||(status=="removeCircle") ){
//   followDao.getMailboxIdForCircle(circleId, (err, result) => {
//     if (err) { return { message: 'err' }; }
//     const circleMailboxId = result;
  
//       const obj = {
//         circleMailboxId: circleMailboxId,
//        command,
//       };
//       const payloads = [{ topic: routes_Topic, messages: JSON.stringify(obj), partition: 0 }];
//       producer.send(payloads, (err, data) => {
//         if (err) { return { message: 'err' }; }
//          console.log("data");
//       });
//       producer.on('error', err => ({ message: 'err' }));
//     });

// }

//   consumer.on('error', err => ({ message: 'err' }));
// });

