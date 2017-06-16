const express = require('express');

const app = express();

app.use(require('body-parser').json());

app.use('/circle', require('./api/circle'));

app.use('/mailbox', require('./api/mailbox'));

/** Follow URI is for /mailbox/:mailboxId/circle/:circleId */
app.use('/mailbox/', require('./api/follow'));

// CHANGEME: URI should be same as circle's. Follow the example of lines 11-12
app.use('/publish', require('./api/publish'));

app.use('/circle', require('./api/activity'));


module.exports = app;
