const config = require('../config.json');

let kafka = require('kafka-node'),
  KeyedMessage = kafka.KeyedMessage;

Producer = kafka.Producer,
client = new kafka.Client(config.connectionString, config.clientId);
producer = new Producer(client);
count=0;
function registerProducer(topicName, message, callback) {
  ++count;
  const msg = {
    payload: {
      topicname: `${topicName}`,
      count: `${count}`,
    },
  };
	    console.log('topicName===>', topicName);

  payloads = [
    { topic: `${topicName}`, messages: JSON.stringify(msg) },
  ];
  // console.log('payloads in===>',payloads[0].count);
  // sendcount=payloads[0].count;
  producer.on('ready', () => {
    producer.send(payloads, (err, data) => {
      console.log('send inside registerProducer===>', payloads);

      if (err) { console.log(`${err}`); return; }
      // console.log('payloads===>',payloads);
      return callback(payloads);
    });
  });
  producer.on('error', (err) => { console.log(`${err}`); });
}
// setInterval( registerProducer, 2000,'multiplexer','hi',callback);

function produceToMonitor(topic, count, callback) {
  payloads = [
    { topic: `${topic}`, message: 'khcbdkcd', count: `${count}` },
  ];
  console.log('payloads inside produceToMonitor===>', payloads[0].count);
  // sendcount=payloads[0].count;
  producer.on('ready', () => {
    producer.send(payloads, (err, data) => {
      console.log('send===>', payloads);

      if (err) { console.log(`${err}`); return; }
      // console.log('payloads===>',payloads);
      return callback(payloads);
    });
  });
}
// setInterval(registerProducer, 600);
module.exports = { registerProducer };
