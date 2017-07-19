const communityLifecycleTopic =require('./config').kafka.communityLifecycleTopic;
const communityActivityEventTopic =require('./config').kafka.communityActivityEventTopic;
const groupName = require('./config').kafka.options.groupId;
const kafkaPipeline = require('kafka-pipeline');

const eventsTopic =require('./config').kafka.eventsTopic;
const kafka = require('kafka-node');
const Producer = kafka.HighLevelProducer;
const Client = kafka.Client;
const event_host = require('./config').kafka.event_host;
const event_port = require('./config').kafka.event_port;
const client = new Client(event_host + ':' + event_port);
const producer = new Producer(client);

producer.on('ready', function(){
	kafkaPipeline.producer.ready(function() {
  		kafkaPipeline.registerConsumer(communityLifecycleTopic, groupName,(message, done)=> {
    	console.log(message);
   		writeToEventsTopic(message, function(err, result){
   			if(err) { console.log(err); done(err);}
   			console.log(result);
   			done();
   		})
  		});
  		kafkaPipeline.registerConsumer(communityActivityEventTopic, groupName,(message, done)=> {
    	console.log(message);
   		writeToEventsTopic(message, function(err, result){
   			if(err) { console.log(err); done(err);}
   			console.log(result);
   			done();
   		})
  		});
	});
})

function writeToEventsTopic(message, callback){
   producer.send([{topic: eventsTopic, messages: message}], (err, result) => {
      if(err) {callback(err);}
      callback(null, result);
    });
}