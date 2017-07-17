const kafkaClient = require('./client/kafkaclient');

const consumer = kafkaClient.consumer;

const producer = kafkaClient.producer;

const followDao = require('./dao/getCircles');

const routesTopic = kafkaClient.routesTopic;

consumer.on('message', (message) => {

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
      producer.send(payloads, (err, data) => {
        if (err) { return { message: 'err' }; }
        console.log(data);
      });
      producer.on('error', err => ( return { message: 'err' }));
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