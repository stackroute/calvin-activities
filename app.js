const express = require('express');

const app = express();
app.use(require('body-parser').json());

app.use('/mailbox', require('./api/mailbox'));

app.use('/follow', require('./api/follow'));

app.use('/circles', require('./api/circle_api'));

module.exports = app;
