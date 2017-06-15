const express = require('express');

const app = express();

const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(require('body-parser').json());

app.use('/cartoons', require('./api/cartoons'));

module.exports = app;
