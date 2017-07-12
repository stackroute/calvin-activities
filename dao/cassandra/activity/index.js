const followDao = require('../follow');
const kafkaClient = require('../../../kafka');
const start=require('../../../db');

const listeners = {};

const client=start.client;

function publishActivityToListeners(mid, activity) {
  if (!listeners[mid]) { return; }
  listeners[mid].forEach((socket) => {
    socket.emit('newActivity', activity);
  });
}
function publishToMailbox(mid, activity, callback) {
  const payload = JSON.stringify(activity);
  const query = ('INSERT INTO activity (mailboxId,createdAt,payload) values( ?,?,? )');
  client.execute(query, [mid, activity.timestamp, payload], (err, result) => {
    if (err) { return callback(err); }
    // publishActivityToListeners(mid, activity);
    return callback(err, activity);
  });
}

function createPublishActivity(mid, activity, callback) {
  const msg = {};
  msg.payload = activity;
  msg.payload.requestedAt = new Date();
  msg.circleId = mid;
  kafkaClient.addActivity(msg, (err, data) => callback(err, data));
}

function checkIfMailboxExists(mid, callback) {
  const query = (`SELECT * from activity where mailboxId= ${mid}`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(err, result.rowLength>0);
  });
}

function retriveMessageFromMailbox(mid, callback) {
  checkIfMailboxExists(mid, (err, MailIdExists) => {
    if (err) { return callback(err, null); }
    if (MailIdExists) {
      const query = (`SELECT * from activity where mailboxId= ${mid}`);
      client.execute(query, (err1, result) => {
        if (err1) { return callback(err1); }
        return callback(null, result.rows);
      });
    }
    if(!MailIdExists){
      return callback(null, "No messages found");
    }
  });
}

function addListnerToMailbox(mid, socket) {
  if (!listeners[mid]) { listeners[mid] = []; }
  listeners[mid].unshift(socket);
}

function removeListnerFromMailbox(mid, socket) {
  const index = listeners[mid].indexOf(socket);
  listeners[mid].splice(index, 1);
}


function checkActivityPublished(mid, callback) {
  const query = (`SELECT * from activity where mailboxId= ${mid}`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(null, result.rows);
  });
}

module.exports = {
  publishToMailbox,
  addListnerToMailbox,
  createPublishActivity,
  removeListnerFromMailbox,
  retriveMessageFromMailbox,
  checkActivityPublished,
};
