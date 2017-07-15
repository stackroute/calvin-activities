const registerConsumer = require('../Library/register-consumer');


registerConsumer('topic', 'foo', (msg, done) => {
  console.log('message:', msg);
  done();
});
