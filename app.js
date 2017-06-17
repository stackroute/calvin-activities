// require('./api/push');

const express = require('express');

const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);

const socket = io.listen(server);

// const time = require('express-timestamp');

// app.use(time.init);

app.use(require('body-parser').json());

app.use('/circle', require('./api/circle'));

app.use('/mailbox', require('./api/mailbox'));

/** Follow URI is for /mailbox/:mailboxId/circle/:circleId */
app.use('/mailbox', require('./api/follow'));


// module.exports = { server, socket };

// push(socket);

// module.exports = {server,socket};
// CHANGEME: URI should be same as circle's. Follow the example of lines 11-12

app.use('/circle', require('./api/activity'));


module.exports = app;
