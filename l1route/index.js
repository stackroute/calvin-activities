const config = require('./config.json');

const kafka = require('../kafka/l1route');

const producer = kafka.producer;

const consumer = kafka.consumer;

const redis = require('../client/redisclient').client ;

consumer.on('message', (message) => {
  const key = `${config.L1RCacheNamespace}:${JSON.parse(message.value).circleID}`;
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

