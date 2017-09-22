const followDao = require('../follow');
const kafkaClient = require('../../../kafka');
const start = require('../../../db');
const config = require('../../../config');
const _ = require('lodash');
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
  client.execute(query, [mid, activity.payload.createdAt, msg.payload.id, payload], (err, result) => {
    if (err) { return callback(err); }

    redisPublisher.publish(mid, JSON.stringify({ payload: activity.payload }));
    return callback(err, msg);
  });
}

function createPublishActivity(mid, activity, callback) {
  const msg = JSON.parse(JSON.stringify(activity));
  msg.circleId = mid;
  msg.payload.id = uuid().toString();
  kafkaClient.addActivity(msg, (err, data) => {
    if (err) { callback(err, null); return; }
    const query1 = (`select createdOn from circle where circleId = ${mid}`);
    client.execute(query1, (err1, result) => {
      if (err1) { callback(err1, null); return; }
      if (result && result.rows && result.rows[0]) {
        const c = result.rows[0].createdon;
        const query = ('UPDATE circle SET lastPublishedActivity = ? where circleId=? and createdOn=?');
        client.execute(query, [new Date(), mid, c], (err2, result2) => {
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

function retriveMessageFromMailbox(mid, queryObj, limit, callback) {
  const beforeTime = queryObj.before_time;
  const afterTime = queryObj.after_time;
  let beforeId;
  let afterId;
  if (beforeTime !== undefined) {
    afterId = queryObj.after_id;
  } else {
    beforeId = queryObj.before_id;
  }
  checkIfMailboxExists(mid, (err, MailIdExists) => {
    if (err) { callback(err, null); return; }
    if (!MailIdExists) { callback(null, { a: 0, b: [] }); } else {
      let query;
      if (limit === 0) {
        callback('Limit is zero'); return;
      } else if (limit === '-1') {
        if (beforeTime !== undefined) {
          if (afterId !== undefined) {
            query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < '${beforeTime}' and activityId > ${afterId}`);
          } else {
            query = (`SELECT * from activity where mailboxId = ${mid} and createdAt <= '${beforeTime}'`);
          }
        } else if (afterTime !== undefined) {
          if (beforeId !== undefined) {
            query = (`SELECT * from activity where mailboxId= ${mid} and createdAt > '${afterTime}' and activityId < ${beforeId}`);
          } else {
            query = (`SELECT * from activity where mailboxId= ${mid} and createdAt >= '${afterTime}'`);
          }
        } else {
          query = (`SELECT * from activity where mailboxId= ${mid}`);
        }
      } else if (limit !== undefined) {
        if (beforeTime !== undefined) {
          if (afterId !== undefined) {
            query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < '${beforeTime}' and activityId > ${afterId}  limit ${limit}`);
          } else {
            query = (`SELECT * from activity where mailboxId = ${mid} and createdAt <= '${beforeTime}' limit ${limit}`);
          }
        } else if (afterTime !== undefined) {
          if (beforeId !== undefined) {
            query = (`SELECT * from activity where mailboxId= ${mid} and createdAt > '${afterTime}' and activityId < ${beforeId} limit ${limit}`);
          } else {
            query = (`SELECT * from activity where mailboxId= ${mid} and createdAt >= '${afterTime}' limit ${limit}`);
          }
        } else {
          query = (`SELECT * from activity where mailboxId= ${mid} limit ${limit}`);
        }
      } else {
        const defaultLimit = config.defaultLimit;
        if (beforeTime !== undefined) {
          if (afterId !== undefined) {
            query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < '${beforeTime}' and activityId > ${afterId}  limit ${defaultLimit}`);
          } else {
            query = (`SELECT * from activity where mailboxId = ${mid} and createdAt <= '${beforeTime}' limit ${defaultLimit}`);
          }
        } else if (afterTime !== undefined) {
          if (beforeId !== undefined) {
            query = (`SELECT * from activity where mailboxId= ${mid} and createdAt > '${afterTime}' and activityId < ${beforeId} limit ${defaultLimit}`);
          } else {
            query = (`SELECT * from activity where mailboxId= ${mid} and createdAt >= '${afterTime}' limit ${defaultLimit}`);
          }
        } else {
          query = (`SELECT * from activity where mailboxId= ${mid} limit ${defaultLimit}`);
        }
      }

      const options = { fetchSize: 100 };
      const activities = [];
      let activitiesCount = 0;
      let activitiesResult = [];

      client.eachRow(query, [], options, (n, row) => {
        activities.push(row);
        activitiesCount += 1;
      }, (err1, result) => {
        if (afterId || beforeId) {
          const filteredActivities = _.filter(activities,
            a => (afterId ? (a.activityid > afterId) : (a.activityid < beforeId)));
          activitiesResult = activitiesResult.concat(filteredActivities);
        } else {
          activitiesResult = activitiesResult.concat(activities);
        }

        if (result.nextPage && activitiesResult.length < limit) {
          activitiesCount = 0;
          activitiesResult = [];
          result.nextPage();
        } else {
          callback(null, { a: activitiesResult.length, b: activitiesResult });
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
