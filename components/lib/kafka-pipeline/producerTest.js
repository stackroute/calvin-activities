const producer = require('./producer');
const {send} = producer;
const kafka = require('kafka-node'),
  Consumer = kafka.Consumer;
const { host, port } = require('./config').kafka;

const client = new kafka.Client(`${host}:${port}`);
// console.log(client);

count = 0;

setInterval(() => {
	 count -= count;
  count++;
  console.log('count initializer', count);
  // console.log('setInterval');
  send([{ topic: 't1', messages: [JSON.stringify({ foo: 'bar' })] }]);

	

  const consumer = new Consumer(
    client,
    [
      { topic: 'monitor' },
    ],
    {
      autoCommit: false,
    },
  );
  consumer.on('message', (message) => {
	 const msg =JSON.parse(message.value);
	 if (count === JSON.parse(msg.topicCount)) {
      console.log('if count==>', count);
      console.log('if count inside consumer==>', JSON.parse(msg.topicCount));
      console.log('true');
    } else {
    	console.log('else count==>', count);
      console.log('else count inside consumer==>', JSON.parse(msg.topicCount));
    	console.log('false');
    }


});
 },3000);

