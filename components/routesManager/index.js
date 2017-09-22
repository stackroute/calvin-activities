const routesManagerDao =require('./services/routes');

const topic =require('./config').kafka.topics[0];

const groupName = require('./config').kafka.options.groupId;

const kafkaPipeline = require('kafka-pipeline');

kafkaPipeline.registerConsumer(topic, groupName, (message, done) => {
  console.log(message);
  const messages= JSON.parse(message);
  const circleId= messages.circleId;
  const mailboxId = messages.mailboxId;

  if (messages.command === 'addRoute') {
    routesManagerDao.addRoute(circleId, mailboxId, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  } else if (messages.command === 'removeRoute') {
    routesManagerDao.removeRoute(circleId, mailboxId, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  }
  done();
});
