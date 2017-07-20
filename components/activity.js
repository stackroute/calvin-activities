var kafka = require('kafka-node');
var Producer = kafka.HighLevelProducer;
var Client = kafka.Client;
var client = new Client('localhost:2181');
var producer = new Producer(client);


var topicName = 'events1';
var msg = JSON.stringify({
 "domain": "domain1",
 "toolid": "tool in which the activity was executed",
 "activitytype": "type of the activity, specifies what exactly was the activity about",
 "actortype": "type of actor, specifies who exactly executed this activity",
 "objecttype": "type of object, specifies the subject of the activity or is the real entity of the activity",
 "ts": "when was this activity happened",
 "payload": {
   as : "will contain payload of the event information in w3c standard activity stream message format or similar to"
 },
 "refid": "Reference for community to know about the event it published, used for internal purpose"
});
 producer.on('ready', function(){
 producer.send([{topic: topicName, messages: msg}], (err, result) => {
     console.log(err);
     console.log(result);
   });
});


var redis = require('thunk-redis');