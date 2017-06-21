const start=require('../../../db');

const client=start.client;

function addFollow(follower, callback) {
  const query = ('INSERT INTO follow (circleid, mailboxid ) values(?, ? )');
  client.execute(query, [follower.circleId, follower.mailboxId], (err, result) => {
    if (err) { throw err; }
    return callback(err, follower);
  });
}

function checkIfFollowExists(follower, callback) {
  const query = (`SELECT * from follow where circleid = ${follower.circleId}
   AND mailboxid = ${follower.mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(null, result.rowLength > 0);
  });
}

function deleteFollow(follower, callback) {
  const deleteQuery =(`DELETE FROM follow where circleid =${follower.circleId} AND mailboxid=${follower.mailboxId}`);
  client.execute(deleteQuery, (err, result) => {
    if (err) { return callback(err); }
    return callback(null, follower);
  });
}

module.exports = {
  deleteFollow,
  addFollow,
  checkIfFollowExists,
};
