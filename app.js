require('./api/push');

const express = require('express');

const app = express();

app.use(require('body-parser').json());

app.use('/circle', require('./api/circle'));

app.use('/mailbox', require('./api/mailbox'));

/** Follow URI is for /mailbox/:mailboxId/circle/:circleId */
app.use('/mailbox', require('./api/follow'));

const server = require('http').Server(app);

const io = require('socket.io')(server);

const socket = io.listen(server);

push(socket);

<<<<<<< HEAD
module.exports = {server,socket};
=======
// CHANGEME: URI should be same as circle's. Follow the example of lines 11-12
app.use('/publish', require('./api/publish'));

app.use('/circle', require('./api/activity'));


module.exports = app;
>>>>>>> 771141f1672c3d074d09b898f1f22be12a3b56fa
