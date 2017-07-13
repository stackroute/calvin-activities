/*const {producer} = require('./client/kafkaclient');

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
  if(err) { console.log('err:', err); return; }
  console.log('PRODUCED 1000000 messages');
});*/

const {producer} = require('./client/kafkaclient');
const consumerGroupName = require('./config').consumerGroupName;

function addActivity(n, callback) {
  console.log(`PREPARING ${n} records`);
  let messages = [];
  for(let i=0; i<n; i++) {
    messages.push(JSON.stringify({
      payload: {
        foo: 'bar'
      },
      circleId: 'baz'
    }));
  }

  console.log(`PRODUCING ${n} records`);
  producer.on('ready', () => {
    producer.send([{ topic: 'm1', messages: messages }], (err, data) => callback(err, data));
  });
}

function addMDActivity(n, callback) {
  console.log(`PREPARING ${n} records`);
  let messages = [];
  for(let i=0; i<n; i++) {
    messages.push(JSON.stringify({
      payload: {
        foo: 'bar'
      },
      mailboxId: '9da64d71-fc74-4c45-9249-153d4751c7a6'
    }));
  }

  console.log(`PRODUCING ${n} records`);
  producer.on('ready', () => {
    producer.send([{ topic: 'm1D', messages: messages }], (err, data) => callback(err, data));
  });
}

if(consumerGroupName.indexOf('D') > -1){
  addMDActivity(10000, (err, result) => {
    if(err) { console.log('error:', err) ; return;}
    console.log('PRODUCED 1000000 records');
  });
}
else{
  addActivity(10000, (err, result) => {
  if(err) { console.log('error:', err) ; return;}
  console.log('PRODUCED 1000000 records');
});
}

