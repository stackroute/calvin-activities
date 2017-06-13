const express = require('express');

const app = express();
app.use(require('body-parser').json());

app.use('/mailbox', require('./api/mailbox'));

app.use('/circle', require('./api/circle'));

module.exports = app;
