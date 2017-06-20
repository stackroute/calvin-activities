const express = require('express');

const app = express();

app.use(require('body-parser').json());

// TODO: Move this authorize middleware as a separate file. Require to use it.
const authorize = require('./authorize');

// TODO: Instead of using it in this fashion, provide the user an option to use it only when necessary.
app.use('/circle', authorize.verifyToken, require('./api/circle'));

app.use('/mailbox', authorize.verifyToken, require('./api/mailbox'));

/** Follow URI is for /mailbox/:mailboxId/circle/:circleId */
app.use('/mailbox/', authorize.verifyToken, require('./api/follow'));

module.exports = app;
