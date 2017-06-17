const express = require('express');

const app = express();

const swaggerUi = require('swagger-ui-express');

const req = require('require-yml');

const swaggerDocument = req('./swagger/api.yml');

const swaggerDocumentMailbox = req('./swagger/apiMailbox.yml');

app.use(require('body-parser').json());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/swaggerMailbox', swaggerUi.serve, swaggerUi.setup(swaggerDocumentMailbox));

app.use('/circle', require('./api/circle'));

app.use('/mailbox', require('./api/mailbox'));

/** Follow URI is for /mailbox/:mailboxId/circle/:circleId */
app.use('/mailbox/', require('./api/follow'));

module.exports = app;
