const communityLifecycleTopic =require('./config').kafka.communityLifecycleTopic;
const communityActivityEventTopic =require('./config').kafka.communityActivityEventTopic;
const groupName = require('./config').kafka.options.groupId;
const eventsTopic =require('./config').kafka.eventsTopic;
const kafka = require('kafka-node');
const Producer = kafka.HighLevelProducer;
const Client = kafka.Client;
const event_host = require('./config').kafka.event_host;
const event_port = require('./config').kafka.event_port;
const client = new Client(event_host + ':' + event_port);
const producer = new Producer(client);

const ConsumerGroup = require('kafka-node').ConsumerGroup;
const host = require('./config').kafka.host;
const port = require('./config').kafka.port;

const options = {
	host: host + ':' + port,
  	groupId: groupName,
  	sessionTimeout: 15000,
  	protocol: ['roundrobin'],
  	fromOffset: 'earliest'
}

const topics = [communityLifecycleTopic, communityActivityEventTopic];

const consumergroup = new ConsumerGroup(Object.assign({'id':'consumer_xyz'}, options), topics);
console.log('consumer options');
console.log(options);
console.log('consumer topics');
console.log(topics);
console.log('producer client');
console.log(event_host + ':' + event_port);

producer.on('ready', function(){
	console.log('producer is ready');
	consumergroup.on('message', function(message){
		console.log('got message from community');
		console.log(message);
		const event = JSON.parse(JSON.stringify(message.value));
		writeToEventsTopic(event, function(err, result){
   			if(err) { console.log(err);}
   			console.log(result);
   		})
	})
})

function writeToEventsTopic(message, callback){
	console.log('writing message to event');
	console.log(message);
   producer.send([{topic: eventsTopic, messages: message}], (err, result) => {
      if(err) { console.log(err); callback(err);}
      console.log(result);
      callback(null, result);
    });
}