const {producer} = require('./client/kafkaclient');

const messages = [];

console.log('GENERATING 1000000 messages');
for(let i=0; i<1000000; i++) {
  messages.push(JSON.stringify({
    payload: {
      foo: 'bar'
    },
    circleId: 'baz'
  }));
}

console.log('PRODUCING 1000000 messages');

producer.send([{topic: 'm1', messages: messages}], (err, res) => {
  console.log('PRODUCED 1000000 messages');
});
