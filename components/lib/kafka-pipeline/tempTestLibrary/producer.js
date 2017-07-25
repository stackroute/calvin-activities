const producer = require('../Library/producer');
const {send} = producer;
const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const { host, port } = require('../config').kafka;

const client = new kafka.Client(`${host}:${port}`);
let count =0;

producer.ready(function() {
	setInterval(function() {
		count -= count;
		count++;
	send([{topic: 't1', messages: [JSON.stringify({foo: 'bar'})]}]);
	},5000);
});