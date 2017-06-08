const express = require('express');

const app = express();

app.use(require('body-parser').json());

app.use('/cartoons', require('./api/cartoons'));

module.exports = app;
