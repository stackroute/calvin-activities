const start=require('../../../db');

const client=start.client;
const uuid = start.uuid;

function addFollow(follower, callback) {
  const id1 = uuid();
  const query = ('INSERT INTO circle (id, circleid, mailboxid ) values( ?, ?, ? )');
  client.execute(query, id1, follower.circleId, follower.mailboxId, (err, result) => {
    if (err) { throw err; }
    return callback(err, follower);
  });
}

function checkIfFollowExists(follower, callback) {
  const query = (`SELECT * from follow where circleid = ${follower.circleId}
   AND mailboxid = ${follower.mailboxId} ALLOW FILTERING`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(null, result.rowLength > 0);
  });
  return true;
}

function deleteFollow(follower, callback) {
  checkIfFollowExists(follower, (err, followExists) => {
    if (err) { return callback(err, null); }
    if (followExists === false) {
      return callback(null, `Mailbox with id ${follower.mailboxId} 
    is not following Circle with id ${follower.circleId}`);
    }
    const query =(`DELETE from circle where circleid =${follower.circleId} 
    AND mailboxid=${follower.mailboxId} ALLOW FILTERING`);
    client.execute(query, (error, result) => callback(err, { follower }));
    return true;
  });
}

module.exports = {
  deleteFollow,
  addFollow,
  checkIfFollowExists,
};
