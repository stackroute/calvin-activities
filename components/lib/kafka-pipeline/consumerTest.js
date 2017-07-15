const registerConsumer = require('./register-consumer');

registerConsumer({ host: 'localhost', port: '2181' }, 'topic', 'foo', (msg, done) => {
  console.log('message:', msg);
  done();
});
