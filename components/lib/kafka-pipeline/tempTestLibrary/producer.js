const producer = require('../Library/producer');

const { send } = producer;

let count =0;

producer.ready(() => {
  setInterval(() => {
    count -= count;
    count += 1;
    send([{ topic: 't1', messages: [JSON.stringify({ foo: 'bar' })] }]);
  }, 5000);
});
