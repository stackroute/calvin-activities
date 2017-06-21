const express = require('express');

const app = express();

const swaggerUi = require('swagger-ui-express');

const req = require('require-yml');

const swaggerDocument = req('./swagger/api.yml');

// const swaggerDocumentMailbox = req('./swagger/apiMailbox.yml');

// const swaggerDocumentMailbox = req('./swagger/apifollow.yml');

app.use(require('body-parser').json());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocumentMailbox));

// app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocumentfollow));

app.use('/circle', require('./api/circle'));

app.use('/mailbox', require('./api/mailbox'));

/** Follow URI is for /mailbox/:mailboxId/circle/:circleId */
app.use('/mailbox', require('./api/follow'));

// Publish activity to mailbox
app.use('/mailbox', require('./api/activity'));

// Publish activity to circle
app.use('/circle', require('./api/activity'));

module.exports = app;
