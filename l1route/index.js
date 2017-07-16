const L1RCacheNamespace = require('../config').namespace;

const redis = require('../client/redisclient').client;

const kafkaClient = require('../client/kafkaclient');

const topic =require('../config').kafka.topics[0];

const groupName = require('../config').kafka.options.groupId;

const registerConsumer = require('../components/lib/kafka-pipeline/Library/register-consumer');

const producer = kafkaClient.producer;

// const consumer = kafkaClient.consumer;

registerConsumer(topic, groupName, (message, done) => {
  redis.incr(`${topic}:count`);
  const key = `${L1RCacheNamespace}:${JSON.parse(message.value).circleId}`;
  const msg = JSON.parse(message.value).payload;
  redis.info('server')(function (error, res) {
    return this.select(0);
  })(function (error, res) {
    return this.smembers(key);
  })((error, res) => {
    const payloads =[];
    res.forEach((element) => {
      payloads.push({ topic: element, messages: [message.value] });
    });
    producer.send(payloads, (err, data) => {
      if(err) {console.log(`${error}`); return ; }
      console.log(data);
    });
  });
  done();
});
