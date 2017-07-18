const kafka = require('kafka-node');
const kafkaConfig =require('./config').kafka;
const producer = require('../lib/kafka-pipeline/Library/register-producer');
const {send} = producer;

const client = new kafka.Client(`${kafkaConfig.host}:${kafkaConfig.port}`);
// const producer = new kafka.Producer(client);

// function addActivity(msg, callback) {
//   producer.send([{ topic: kafkaConfig.activitiesTopic, messages: JSON.stringify(msg) }], (err, data) => callback(err, data));
//  // send([{topic:  kafkaConfig.activitiesTopic, messages: JSON.stringify(msg)}]);

// }

//
function addActivity(msg, callback) {
producer.ready(function() {
	send([{topic:  kafkaConfig.activitiesTopic, messages: JSON.stringify(msg)}]);
});
}
//
module.exports = {
  addActivity,
};
