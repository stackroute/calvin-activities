const kafkaConfig =require('./config').kafka;

const kafkaPipeline = require('kafka-pipeline');

function addActivity(msg, callback) {
  kafkaPipeline.producer.ready(() => {
    kafkaPipeline.producer.send([{ topic: kafkaConfig.activitiesTopic, messages: JSON.stringify(msg) }]);
    return callback();
  });
}
//
module.exports = {
  addActivity,
};
