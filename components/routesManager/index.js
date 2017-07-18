const kafkaClient = require('./client/kafkaclient');

const routesManagerDao =require('./dao/routes_service');

const topic =require('./config').kafka.topics[0];

const groupName = require('./config').kafka.options.groupId;

const kafkaPipeline = require('kafka-pipeline');

kafkaPipeline.registerConsumer(topic, groupName, (message, done) => {
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


