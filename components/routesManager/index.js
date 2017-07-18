const kafkaClient = require('./client/kafkaclient');

const consumer = kafkaClient.consumer;

const routesManagerDao =require('./dao/routes_service');


consumer.on('message', function (message) {
  const messages= JSON.parse(message.value) ;
  const circleId= messages.circleId;
  const mailboxId = messages.mailboxId;

  if (messages.command == 'addRoute'){
    routesManagerDao.addRoute(circleId,mailboxId,(err,result)=>{
      if(err){ console.log({ message: 'err' }) }
      else{ console.log(result); }
    })
  }

  else if (messages.command == 'removeRoute'){
    /*routesManagerDao.removeRoute(circleId,mailboxId,(err,result)=>{
      if(err){return { message: 'err' } }
      else {return { message: 'result' } }
    })*/
  }
});

consumer.on('error', function (err) {return { message: 'err' } });
