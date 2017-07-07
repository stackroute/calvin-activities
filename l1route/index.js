const L1RCacheNamespace = require('../config').namespace;

const redis = require('../client/redisclient').client ;

const kafkaClient = require('../client/kafkaclient');

const topic =require('../config').kafka.topics.topic;

const producer = kafkaClient.producer;

const consumer = kafkaClient.consumer;

consumer.on('message', (message) => {

  redis.incr(`${topic}:count`);
  const key = `${L1RCacheNamespace}:${JSON.parse(message.value).circleID}`;
  const msg = JSON.parse(message.value).message;
  redis.client.info('server')(function (error, res) {
    return this.select(0);
  })(function (error, res) {
    return this.smembers(key);
  })((error, res) => {
    const payloads =[];
    res.forEach((element) => {
      payloads.push({ topic: element, messages: [JSON.stringify(msg)] });
    });
    producer.send(payloads, (err, data) => {
      console.log(data);
    });
  });
});
