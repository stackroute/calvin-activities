const producer = require('./components/lib/kafka-pipeline/Library/register-producer');

const {send} = producer;

const kafka = require('kafka-node');

const kafkaConfig =require('./config').kafka;

const client = new kafka.Client(`${kafkaConfig.host}:${kafkaConfig.port}`);
// const producer = new kafka.Producer(client);


// function addActivity(msg, callback) {
//   producer.send([{ topic: kafkaConfig.activitiesTopic, messages: JSON.stringify(msg) }], (err, data) => callback(err, data));
// }

function addActivity(msg, callback) {
	producer.ready(function() {
	send([{ topic: kafkaConfig.activitiesTopic, messages: JSON.stringify(msg) }], (err, data) => callback(err, data));
});
}


module.exports = {
  addActivity,
};
