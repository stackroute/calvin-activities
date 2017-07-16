const routesManagerDao =require('./dao/routes_service');

const topic = require('./config').kafka.topics[0];
const groupName = require('./config').kafka.options.groupId;
const registerConsumer = require('../lib/kafka-pipeline/Library/register-consumer');


registerConsumer(topic, groupName, (message, done) => {
  const messages= JSON.parse(message.value) ;
  
      const circleId= messages.circleid;
      const mailboxId = messages.mailboxId;
      
    if (messages.command == 'addRoute'){
         routesManagerDao.addRoute(circleId,mailboxId,(err,result)=>{
         if(err){return { message: 'err' } }
         else{console.log(result);}
     })
        }
    else if (messages.command== 'removeRoute'){
         routesManagerDao. removeRoute(circleId,mailboxId,(err,result)=>{
         if(err){return { message: 'err' } }
         else {return { message: 'result' } }
     });
    }
  done();
});
