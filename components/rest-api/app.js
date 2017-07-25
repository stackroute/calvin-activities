const express = require('express');

const app = express();

const swaggerUi = require('swagger-ui-express');

const req = require('require-yml');

const swaggerDocument = req('./swagger/api.yml');

app.use(require('body-parser').json());

const authorize = require('./authorize');

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
   next();
 });

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(authorize.verifyToken);

app.use('/circle', require('./api/circle'));

app.use('/mailbox', require('./api/mailbox'));

/** Follow URI is for /mailbox/:mailboxId/circle/:circleId */
app.use('/mailbox/', require('./api/follow'));

// Publish activity to mailbox
app.use('/mailbox', require('./api/activity'));

// Publish activity to circle
app.use('/circle', require('./api/activity'));

// Multiplexer
app.use('/multiplexer', require('./api/multiplexer'));

// Routes
app.use('/routes', require('./api/routes'));

app.use('/l1route', require('./api/l1r'));

// app.use('/multiplxerrouter', require('./api/multiplexer_routes'));

app.use('/mailbox', require('./api/bulk'));

app.use('/events', require('./api/event'));

app.use('/multiplexerRoute', require('./api/multiplexer-route'));

app.use('/adapter', require('./api/adapter/circle'));

app.use('/adapter', require('./api/adapter/follow'));

app.use('/adapter', require('./api/adapter/mailbox'));

app.use('/adapter', require('./api/adapter/activity'));

app.use('/adapter', require('./api/adapter/route'));

module.exports = app;
