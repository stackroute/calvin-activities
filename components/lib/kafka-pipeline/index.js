const registerconsumer = require('./register-consumer');

// registerconsumer.registerConsumer(config, topicName, consumerGroupName, onMessage);

// module.exports = { registerConsumer };

function registerConsumer(config, topicName, consumerGroupName, onMessage) {
  console.log('inside index.js library file');
	 return registerconsumer.registerConsumer(config, topicName, consumerGroupName, onMessage);
}

module.exports ={
  registerConsumer,
};
