const config = require('../config.json');

var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.Client(config.connectionString,config.clientId);
    producer = new Producer(client);
    	count=0;
function registeredProducer(topicName,message, callback) {
    count++;
	console.log('client==>,'+JSON.stringify(client));

payloads = [
        { topic: `${topicName}`, messages: `${message}`}
    ];
producer.on('ready', function () {
    producer.send(payloads, function (err, data) {

        if(err) { console.log(`${err}`); return; }
        console.log('payloads===>',payloads);
              return callback(payloads);
});
});
producer.on('error', function (err) { console.log(`${err}`); return; })
}

module.exports = { registeredProducer };
