const app = require('./app');
const winston = require('./winston');

app.listen(3000, () => {
  winston.log('info', 'Express server listening on port:', 3000);
});
