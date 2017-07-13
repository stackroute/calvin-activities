const producer1 = require('./producer');

function producer(msg) {
    
    console.log('Successfull  :', msg);
}
const topicName = 'testtopic2';
const message = 'hello world';

producer1.registeredProducer(topicName, message, producer);
