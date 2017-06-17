const express = require('express');

const app = express();

app.use(require('body-parser').json());

const JWT = require('jwt-async');

const jwt = new JWT();

const configFile = require('fs').readFileSync('secret.json');

const config = JSON.parse(configFile);

jwt.setSecret(config.secretKey);

const authorize = (req, res, next) => {
  const auth = req.get('Authorization');
  if (!auth) { return res.status(401).send('Authorization Required'); } else if (!auth.includes('Bearer')) { return res.status(401).send('Invalid Authorization'); }

  const token = auth.split(' ').pop().toString();
  const tokenStatus = jwt.verify(token, (err, result) => {
    if (err) { return res.status(401).send('Invalid Authorization'); }
    return 'Authorized';
  });
  return next();
};

app.use('/', authorize);

app.use('/circle', require('./api/circle'));

app.use('/mailbox', require('./api/mailbox'));

/** Follow URI is for /mailbox/:mailboxId/circle/:circleId */
app.use('/mailbox/', require('./api/follow'));

module.exports = app;
