const registerConsumer = require('../Library/register-consumer');


registerConsumer('events', 'foo', (msg, done) => {
  console.log('message:', msg);
  done();
});
