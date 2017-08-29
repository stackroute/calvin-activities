const followDao = require('../follow');
const kafkaClient = require('../../../kafka');
const start = require('../../../db');
const config = require('../../../config');
const _ = require('lodash');
const redis = require('redis');
const redisPublisher = redis.createClient({host:config.redis.host, port: config.redis.port});
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
  activity.payload.id = uuid().toString();
  const payload = JSON.stringify(activity.payload);
  const query = ('INSERT INTO activity (mailboxId,createdAt, activityId, payload) values( ?,?,?,? )');
  client.execute(query, [mid, activity.payload.createdAt, activity.payload.id, payload], (err, result) => {
    if (err) { return callback(err); }

    redisPublisher.publish(mid, JSON.stringify({ payload: activity.payload}));
    return callback(err, activity);
  });
}

function createPublishActivity(mid, activity, callback) {
  const msg = JSON.parse(JSON.stringify(activity));
  activity.circleId = mid;
  activity.payload.id = uuid().toString();
  kafkaClient.addActivity(activity, (err, data) => {
    if (err) { return callback(err, null); }
    const query1 = (`select createdOn from circle where circleId = ${mid}`);
    client.execute(query1, (err, result) => {
      if (err) { return callback(err, null); }
      if(result && result.rows && result.rows[0]){
        const c = result.rows[0].createdon;
        const query = ('UPDATE circle SET lastPublishedActivity = ? where circleId=? and createdOn=?');
        client.execute(query, [new Date(), mid, c], (err, result) => {
          if (err) { return callback(err, null); }
          callback(null, msg);
        });
      }
      else{
        return callback('Circle does not exists');
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
  let before_time  = queryObj.before_time;
  let after_time = queryObj.after_time;
  checkIfMailboxExists(mid, (err, MailIdExists) => {
    if (err) { return callback(err, null); }
    if(!MailIdExists) { return callback(null, { a : 0, b : []});}
    else {
      let query;
      if(limit === 0){
        return callback('Limit is zero');
      }
      else if(limit === '-1'){
        if (before_time !== undefined) {
          if(after_id !== undefined){
            query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < '${before_time}' and activityId > ${after_id}`);
          }
          else{
            query = (`SELECT * from activity where mailboxId = ${mid} and createdAt <= '${before_time}'`);
          }
        }
        else if (after_time !== undefined) {
          if(before_id !== undefined){
            query = (`SELECT * from activity where mailboxId= ${mid} and createdAt > '${after_time}' and activityId < ${before_id}`);
          }
          else{
            query = (`SELECT * from activity where mailboxId= ${mid} and createdAt >= '${after_time}'`);
          }

        }
        else {
          query = (`SELECT * from activity where mailboxId= ${mid}`);
        }
      }
      else if(limit !== undefined){
        if (before_time !== undefined) {
          if(after_id !== undefined){
            query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < '${before_time}' and activityId > ${after_id}  limit ${limit}`);
          }
          else{
            query = (`SELECT * from activity where mailboxId = ${mid} and createdAt <= '${before_time}' limit ${limit}`);
          }
        }
        else if (after_time !== undefined) {
          if(before_id !== undefined){
            query = (`SELECT * from activity where mailboxId= ${mid} and createdAt > '${after_time}' and activityId < ${before_id} limit ${limit}`);
          }
          else{
            query = (`SELECT * from activity where mailboxId= ${mid} and createdAt >= '${after_time}' limit ${limit}`);
          }
        }
        else {
          query = (`SELECT * from activity where mailboxId= ${mid} limit ${limit}`);
        }
      }
      else{
        const defaultLimit = config.defaultLimit;
        if (before_time !== undefined) {
          if(after_id !== undefined){
            query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < '${before_time}' and activityId > ${after_id}  limit ${defaultLimit}`);
          }
          else{
            query = (`SELECT * from activity where mailboxId = ${mid} and createdAt <= '${before_time}' limit ${defaultLimit}`);
          }
        }
        else if (after_time !== undefined) {
          if(before_id !== undefined){
            query = (`SELECT * from activity where mailboxId= ${mid} and createdAt > '${after_time}' and activityId < ${before_id} limit ${defaultLimit}`);
          }
          else{
            query = (`SELECT * from activity where mailboxId= ${mid} and createdAt >= '${after_time}' limit ${defaultLimit}`);
          }
        }
        else {
          query = (`SELECT * from activity where mailboxId= ${mid} limit ${defaultLimit}`);
        }
      }

      let before_id;
      let after_id;
      if(before_time !== undefined){
        after_id = queryObj.after_id;
      }
      else{
        before_id = queryObj.before_id;
      }

      const options = { fetchSize : 100 };
      let activities = [];
      let activitiesCount = 0;
      let activitiesResult = [];

      client.eachRow(query, [], options, function (n, row) {
        activities.push(row);
        activitiesCount += 1;
      }, function (err, result) {
        if(after_id || before_id){
          const filteredActivities = _.filter(activities, 
            function(a) { return after_id ? (a.activityid > after_id) : (a.activityid < before_id)});
          activitiesResult = activitiesResult.concat(filteredActivities);
        }
        else{
          activitiesResult = activitiesResult.concat(activities);
        }

        if (result.nextPage && activitiesResult.length < limit) {
          activitiesCount = 0;
          activitiesResult = [];
          result.nextPage();
        }
        else{
          return callback(null, { a : activitiesResult.length, b: activitiesResult});    
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
