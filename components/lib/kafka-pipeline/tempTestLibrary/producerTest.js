const producer = require('../Library/register-producer');
const {send} = producer;

let count =0;

producer.ready(function() {
	setInterval(function() {
		count -= count;
		count++;
	send([{topic: 't1', messages: [JSON.stringify({foo: 'bar'})]}]);
	},1000);
});