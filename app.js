const express = require('express');

const app = express();

const swaggerUi = require('swagger-ui-express');

const req = require('require-yml');

const swaggerDocument = req('./swagger/api.yml');

app.use(require('body-parser').json());

const authorize = require('./authorize');

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/circle', authorize.verifyToken, require('./api/circle'));

app.use('/mailbox', authorize.verifyToken, require('./api/mailbox'));

/** Follow URI is for /mailbox/:mailboxId/circle/:circleId */
app.use('/mailbox/', authorize.verifyToken, require('./api/follow'));

// Publish activity to mailbox
app.use('/mailbox', authorize.verifyToken, require('./api/activity'));

// Publish activity to circle
app.use('/circle', authorize.verifyToken, require('./api/activity'));

module.exports = app;
