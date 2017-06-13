const express = require('express');

const app = express();
app.use(require('body-parser').json());

app.use('/mailbox', require('./api/mailbox'));

<<<<<<< HEAD
app.use('/follow', require('./api/follow'));

=======
>>>>>>> 8443a00b2edb0927b974f44b346e1ecb6060119f
app.use('/circle', require('./api/circle'));

module.exports = app;
