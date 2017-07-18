const kafkaClient = require('./client/kafkaclient');

// const consumer = kafkaClient.consumer;

const routesManagerDao =require('./dao/routes_service');

const topic =require('./config').kafka.topics[0];

const groupName = require('./config').kafka.options.groupId;

const registerConsumer = require('../lib/kafka-pipeline/Library/register-consumer');

console.log('topic==>',topic);

registerConsumer(topic, groupName, (message, done) => {
console.log('topic==>',topic);
const messages= JSON.parse(message.value) ;
  const circleId= messages.circleId;
  const mailboxId = messages.mailboxId;

  if (messages.command == 'addRoute'){
    routesManagerDao.addRoute(circleId,mailboxId,(err,result)=>{
      if(err){ console.log({ message: 'err' }); return; }
      else{ console.log(result); }
    });
  }

  else if (messages.command== 'removeRoute'){
    routesManagerDao.removeRoute(circleId,mailboxId,(err,result)=>{
      if(err){return { message: 'err' }}
      else {return { message: 'result' } }
    });
  }
  done();
});


// const kafkaClient = require('./client/kafkaclient');

// const consumer = kafkaClient.consumer;

// const routesManagerDao = require('./dao/routes_service');


// consumer.on('message', (message) => {
//   const messages = JSON.parse(message.value);

//   const circleId = messages.circleid;
//   const mailboxId = messages.mailboxId;

//   if (messages.command === 'addRoute') {
//     routesManagerDao.addRoute(circleId, mailboxId, (err, result) => {
//       if (err) {
//         return {
//           message: 'err',
//         };
//       } else {
//         console.log(result);
//       }
//     });
//   } else if (messages.command == 'removeRoute') {
//     routesManagerDao.removeRoute(circleId, mailboxId, (err, result) => {
//       if (err) {
//         return {
//           message: 'err',
//         };
//       } else {
//         return {
//           message: 'result',
//         };
//       }
//     });
//   }
// });

// consumer.on('error', err => ({
//   message: 'err',
// }));
