const app = require('./app');

const winston = require('./winston');

app.listen(3000, () => {
  winston.log('info', 'ExpressJS listening on port:', 3000);
});
