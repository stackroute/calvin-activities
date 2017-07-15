const kafkaClient = require('./client/kafkaclient');

const consumer = kafkaClient.consumer;

const producer = kafkaClient.producer;

const followDao = require('./dao/getCircles');

const routes_Topic =kafkaClient.routesTopic;

consumer.on('message', (message) => {
  mailboxId= JSON.parse(message.value).mailboxId;

  let command;
  let status = JSON.parse(message.value).status

  if ((status == 'useronline')||(status == 'addCircle')) {
    command = 'addRoute';
  } else if ((status == 'useroffline')||(status == 'removeCircle')) {
    command = 'removeRoute';
  } else {
    command = 'undefined';
  }
  followDao.getCirclesForMailbox(mailboxId, (err, result) => {
    if (err) { return { message: 'err' }; }
    const rows = result.rows;

    rows.forEach((element) => {
      const obj = {
        circleid: element.circleid.toString(),
        mailboxid: mailboxId,
        command,
      };
      const payloads = [{ topic: routes_Topic, messages: JSON.stringify(obj), partition: 0 }];
      producer.send(payloads, (err, data) => {
        if (err) { return { message: 'err' }; }
      });
      producer.on('error', err => ({ message: 'err' }));
    });
      console.log(message);
  });

  consumer.on('error', err => ({ message: 'err' }));

