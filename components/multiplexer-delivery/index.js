const kafka = require('kafka-node');

const { ConsumerGroup, Client, HighLevelProducer } = kafka;

const config =require('./config').redis;

const { host, port } = require('./config').kafka;

const client = new Client(`${host}:${port}`);

const producer = new HighLevelProducer(client);

const redis = require('redis');

const redisPublisher = redis.createClient({ host: config.host, port: config.port });

const topic =require('./config').kafka.topics[0];

const groupName = require('./config').kafka.options.groupId;

const id = require('./config').kafka.options.id;

const kafkaPipeline = require('kafka-pipeline');

const activityDAO = require('./dao/activity');

const mailboxDAO = require('./dao/mailbox');

const result = {
  CG: groupName,
  CID: id,
  CDR: 0,
};

setInterval(() => {
  const resultCopy = JSON.parse(JSON.stringify(result));
  result.CDR -= resultCopy.CDR;

  producer.send([{ topic: 'monitor', messages: JSON.stringify(resultCopy) }], (err, res) => {
    if (err) { console.error('ERR:', err); }
  });
}, 1000);

kafkaPipeline.registerConsumer(topic, groupName, (message, done) => {
  console.log(message);
  const receiver = JSON.parse(message).mailboxId;

  const newActivity = {
    payload: JSON.parse(message).payload,
  };

  redisPublisher.publish(receiver, JSON.stringify(newActivity));

  activityDAO.publishToMailbox(receiver, newActivity, (error, data) => {
    result.CDR+=1;
    if (error) { done(error); }
  });
});
