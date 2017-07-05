const config = require('./config.json');

const kafka = require('../kafka');

const producer = kafka.producer;

const consumer = kafka.consumer;

const redis = require('thunk-redis')

const thunk = require('thunks')()

const redisClient = redis.createClient({
  database: 1
});

producer.on('ready', function () {
    consumer.on('message', function (message) {
        const key = config.l1Namespace+":"+JSON.parse(message.value).circleID;
        const msg = JSON.parse(message.value).message;
        redisClient.info('server')(function (error, res) {
        return this.select(0)
        })(function (error, res) {
        return this.smembers(key)
        })(function (error, res) {
        let payloads =[];
            res.forEach(function(element) {
                payloads.push({ topic: element, messages: [ JSON.stringify(msg) ] });
            }, this);
            producer.send(payloads, function (err, data) {
            console.log(data);
            });
        })
    });   
});



