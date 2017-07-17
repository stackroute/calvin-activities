const kafkaClient = require('./client/kafkaclient');

const consumer = kafkaClient.consumer;

const producer = kafkaClient.producer;

const followDao = require('./dao/getCircles');

const routesTopic = kafkaClient.routesTopic;

consumer.on('message', (message) => {

  const mailId= JSON.parse(message.value).mailboxId;
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
  followDao.getCirclesForMailbox(mailId, (err, result) => {
    if (err) { return { message: 'err' } ; }
    const rows = result.rows;

    rows.forEach((element) => {
      const obj = {
        circleId: element.circleid.toString(),
        mailboxId: mailId,
        command,
      };
      const payloads = [{ topic: routesTopic, messages: JSON.stringify(obj), partition: 0 }];
      producer.send(payloads, (err, data) => {
        if (err) { return { message: 'err' }; }
        followDao.syncMailbox(mailId, (err, result) => {
          if(err) {console.log(err);}
        })
      });
      producer.on('error', err => ( console.log({ message: 'err' })));
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
    producer.send(payloads, (err, data) => {
      if (err) { return { message: 'err' }; }
      console.log(data);
    });
    producer.on('error', err => ({ message: 'err' }));
  });
}

consumer.on('error', err => ({ message: 'err' }));
});