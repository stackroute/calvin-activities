const producer1 = require('./register-producer');

function producer(msg) {
  console.log('Successfull  :', msg);
}
const topicName = 'testtopic2';
const message = 'hello world';

producer1.registerProducer(topicName, message, producer);
