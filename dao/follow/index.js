const start=require('../../db');

const client=start.client;
const uuid = start.uuid;

const followapi = [];

function addFollow(follower, callback) {
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
}

module.exports = {
  deleteFollow,
  addFollow,
  checkIfFollowExists,
};
