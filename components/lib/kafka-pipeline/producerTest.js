const producer = require('./producer');
const {send} = producer;
var kafka = require('kafka-node'),

    Consumer = kafka.Consumer;
const {host, port} = require('./config').kafka;

const client = new kafka.Client(`${host}:${port}`);
let count =0;
// require('events').EventEmitter.prototype._maxListeners = 100;


producer.ready(function() {
	setInterval(function() {
		count -= count;
		count++;
	send([{topic: 't1', messages: [JSON.stringify({foo: 'bar'})]}]);
	},1000);
});
