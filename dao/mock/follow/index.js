const start=require('../../db');

const client=start.client;
const uuid = start.uuid;

const followapi = [];

function addFollow(follower, callback) {
<<<<<<< HEAD:dao/follow/index.js
  const query = ('INSERT INTO follow (id, circle_id, mailbox_id) values(uuid(), ?, ?)');
  client.execute(query, follower.circleId, follower.mailboxId, (err, result) => callback(err, follower));
}

function checkIfFollowExists(follower, callback) {
  const query = (`SELECT * from follow where circle_id = ${follower.circleId} AND mailbox_id = ${follower.mailboxId} ALLOW FILTERING`);
  console.log('result');
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(null, result.rowLength > 0);
  });
}

function deleteFollow(follower, callback) {
  const query = (`DELETE from follow where circle_id = ${follower.circleId} AND mailbox_id = ${follower.mailboxId} ALLOW FILTERING`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(null, result.rowLength > 0);
  });
=======
  followapi.push(follower);
  return callback(null, follower);
}

function checkIfFollowExists(follower, callback) {
  const filterData = follow => follow.circleId === follower.circleId && follow.mailboxId === follower.mailboxId;
  const filteredFollowers = followapi.filter(filterData);
  return callback(null, filteredFollowers.length !== 0);
}
function deleteFollow(follower, callback) {
  const filter = followapi.filter(y => y.circleId === follower.circleId && y.mailboxId === follower.mailboxId);
  followapi.splice(followapi.indexOf(filter[0]), 1);
  return callback(null, filter[0]);
>>>>>>> api-release:dao/mock/follow/index.js
}

function splitMailId(circleId, callback) {
  const splitMailIdd = followapi.filter(y => y.circleId === circleId);
  return callback(null, splitMailIdd);
}

module.exports = {
  deleteFollow,
  addFollow,
  checkIfFollowExists,
  splitMailId,
};
