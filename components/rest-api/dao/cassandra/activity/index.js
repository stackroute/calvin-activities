const kafkaClient = require('../../../kafka');

const start = require('../../../db');

const config = require('../../../config');

const redis = require('redis');

const redisPublisher = redis.createClient({ host: config.redis.host, port: config.redis.port });

const listeners = {};

const client = start.client;

const uuid = start.uuid;

function publishActivityToListeners(mid, activity) {
  if (!listeners[mid]) { return; }
  listeners[mid].forEach((socket) => {
    socket.emit('newActivity', activity);
  });
}
function publishToMailbox(mid, activity, callback) {
  const msg = JSON.parse(JSON.stringify(activity));
  msg.payload.id = uuid().toString();
  const payload = JSON.stringify(activity.payload);
  const query = ('INSERT INTO activity (mailboxId,createdAt, activityId, payload) values( ?,?,?,? )');
  client.execute(query, [mid, activity.payload.createdAt, msg.payload.id, payload], (err) => {
    if (err) { return callback(err); }

    redisPublisher.publish(mid, JSON.stringify({ payload: activity.payload }));
    return callback(err, msg);
  });
}

function createPublishActivity(mid, activity, callback) {
  const msg = JSON.parse(JSON.stringify(activity));
  msg.circleId = mid;
  msg.payload.id = uuid().toString();
  kafkaClient.addActivity(msg, (err) => {
    if (err) { callback(err, null); return; }
    const query1 = (`select createdOn from circle where circleId = ${mid}`);
    client.execute(query1, (err1, result) => {
      if (err1) { callback(err1, null); return; }
      if (result && result.rows && result.rows[0]) {
        const c = result.rows[0].createdon;
        const query = ('UPDATE circle SET lastPublishedActivity = ? where circleId=? and createdOn=?');
        client.execute(query, [new Date(), mid, c], (err2) => {
          if (err2) { callback(err2, null); return; }
          callback(null, msg);
        });
      } else {
        callback('Circle does not exists');
      }
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

function retriveMessageFromMailbox(mid, beforeTime, afterTime, limit, callback) {
  let sendReverseList = false;
  let fetchCount = limit;

  checkIfMailboxExists(mid, (err, mailIdExists) => {
    if (err) { callback(err, null); return; }
    if (!mailIdExists) { callback(null, { a: 0, b: [] }); } else {
      let query;
      if (limit === 0) {
        callback('Limit is zero'); return;
      } else {
        if (fetchCount === undefined) {
          fetchCount = config.defaultLimit;
        }
        if (beforeTime !== undefined) {
          query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < '${beforeTime}' limit ${fetchCount}`);
        } else if (afterTime !== undefined) {
          query = (`SELECT * from activity where mailboxId = ${mid} and createdAt > '${afterTime}' order by createdAt limit ${fetchCount}`);
          sendReverseList = true;
        } else {
          query = (`SELECT * from activity where mailboxId = ${mid} limit ${fetchCount}`);
        }
      }

      const options = { fetchSize: 100 };
      let activities = [];
      let activitiesResult = [];
      client.eachRow(query, [], options, (n, row) => {
        activities.push(row);
      }, (err1, result) => {
        if (err1) { callback(err1); return; }
        activitiesResult = activitiesResult.concat(activities);
        if (result.nextPage && activitiesResult.length < fetchCount) {
          activities = [];
          result.nextPage();
        } else if (!sendReverseList) {
          callback(null, { a: activitiesResult.length, b: activitiesResult });
        } else {
          callback(null, { a: activitiesResult.length, b: activitiesResult.reverse() });
        }
      });
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
  publishActivityToListeners,
  listeners,
};
