const consumer1 = require('./requireConsumer');

function consumer(msg) {
  console.log('msg:', msg);
}

const topicName = 'testtopic2';
const consumerGroupName = 'consumerGroupName';

consumer1.registerConsumer(topicName, consumerGroupName, consumer);
