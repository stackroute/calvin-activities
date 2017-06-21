const start=require('../../../db');

const client=start.client;
const uuid = start.uuid;

function addFollow(follower, callback) {
  const id1 = uuid();
  const query = ('INSERT INTO follow (id, circleid, mailboxid ) values( ?, ?, ? )');
  client.execute(query, [id1, follower.circleId, follower.mailboxId], (err, result) => {
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
}

function deleteFollow(follower, callback) {
  const query =(`SELECT * from follow where circleid =${follower.circleId} 
    AND mailboxid=${follower.mailboxId} ALLOW FILTERING`);
  client.execute(query, (error, result) => {
    if (error) { return callback(error, null); }
    const deleteQuery =(`DELETE FROM follow where id =${result.rows[0].id}`);
    client.execute(deleteQuery, (err) => {
      if (err) { return callback(err); }
      return 0;
    });
    return callback(null, follower);
  });
}

module.exports = {
  deleteFollow,
  addFollow,
  checkIfFollowExists,
};
