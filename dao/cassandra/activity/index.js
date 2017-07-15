const followDao = require('../follow');
const kafkaClient = require('../../../kafka');
const start = require('../../../db');
const config = require('../../../config');

const listeners = {};

const client = start.client;

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
    return callback(err, activity);
  });
}

function createPublishActivity(mid, activity, callback) {
  const msg = {};
  msg.payload = activity;
  msg.payload.requestedAt = new Date();
  msg.circleId = mid;
  kafkaClient.addActivity(msg, (err, data) => {
    if (err) { return callback(err, null); }
    const query1 = (`select createdOn from circle where circleId = ${mid}`);
    client.execute(query1, (err, result) => {
      if (err) { return callback(err, null); }
      let c = result.rows[0].createdon;
      const query = (`UPDATE circle SET lastPublishedActivity = ? where circleId=? and createdOn=?`);
      client.execute(query, [new Date(), mid, c], (err, result) => {
        if (err) { return callback(err, null); }
        callback(null, data);
      });
    });
  });
}

function checkIfMailboxExists(mid, callback) {
  const query = (`SELECT * from activity where mailboxId= ${mid}`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(err, result.rowLength > 0);
  });
}

function retriveMessageFromMailbox(mid, before, after, limit, callback) {
  checkIfMailboxExists(mid, (err, MailIdExists) => {
    if (err) { return callback(err, null); }
    if (MailIdExists && limit != 0) {
      if (after != undefined && limit === undefined) {
        const query = (`SELECT * from activity where mailboxId = ${mid} and createdAt > ${after} limit ${config.defaultLimit}`);
        client.execute(query, (err1, result) => {
          if (err1) { return callback(err1); }
          return callback(null, result.rows);
        });
      }
      if (after != undefined && limit == -1) {
        const query = (`SELECT * from activity where mailboxId= ${mid} and createdAt > ${after}`);
        client.execute(query, (err1, result) => {
          if (err1) { return callback(err1); }
          return callback(null, result.rows);
        });
        return;
      }

      if (limit != undefined && after != undefined) {
        const query = (`SELECT * from activity where mailboxId= ${mid} and createdAt > ${after} limit ${limit}`);
        client.execute(query, (err1, result) => {
          if (err1) { return callback(err1); }
          return callback(null, result.rows);
          return;
        });
      }
      if (before != undefined && limit === undefined) {
        const query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < ${before} limit ${config.defaultLimit}`);
        client.execute(query, (err1, result) => {
          if (err1) { return callback(err1); }
          return callback(null, result.rows);
        });
      }

      if (before != undefined && limit == -1) {
        const query = (`SELECT * from activity where mailboxId= ${mid} and createdAt < ${before}`);
        client.execute(query, (err1, result) => {
          if (err1) { return callback(err1); }
          return callback(null, result.rows);
        });
      }

      if (limit != undefined && before != undefined) {
        const query = (`SELECT * from activity where mailboxId= ${mid} and createdAt < ${before} limit ${limit}`);
        client.execute(query, (err1, result) => {
          if (err1) { return callback(err1); }
          return callback(null, result.rows);
        });
      }

      if (after != undefined && before != undefined && limit === undefined) {
        const query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < ${before} and createdAt > ${after} limit ${config.defaultLimit}`);
        client.execute(query, (err1, result) => {
          if (err1) { return callback(err1); }
          return callback(null, result.rows);
        });
      }
      if (after === undefined && before === undefined && limit === undefined) {
        const query = (`SELECT * from activity where mailboxId = ${mid} limit ${config.defaultLimit}`);
        client.execute(query, (err1, result) => {
          if (err1) { return callback(err1); }
          return callback(null, result.rows);
        });
      }

      if (after != undefined && before != undefined && limit == -1) {
        const query = (`SELECT * from activity where mailboxId= ${mid} and createdAt < ${before} and createdAt > ${after}`);
        client.execute(query, (err1, result) => {
          if (err1) { return callback(err1); }
          return callback(null, result.rows);
        });
      }

      if (limit != undefined && before != undefined && after != undefined) {
        const query = (`SELECT * from activity where mailboxId= ${mid} and createdAt < ${before} and createdAt > ${after} limit ${limit}`);
        client.execute(query, (err1, result) => {
          if (err1) { return callback(err1); }
          return callback(null, result.rows);
        });
      }
    }
    else { return callback(null, "limit is 0"); }
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
  publishActivityToListeners,
};
