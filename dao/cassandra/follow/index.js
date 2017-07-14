const start=require('../../../db');

const client=start.client;

function addFollow(follower, startedFollowing, callback) {
  const query = ('INSERT INTO mailboxesFollowingCircle (circleid, mailboxid, startedFollowing ) values(?, ?, ? )');
  client.execute(query, [follower.circleId, follower.mailboxId, startedFollowing], (err, result) => {
    if (err) { throw err; }
    const query2 = ('INSERT INTO circlesFollowedByMailbox (mailboxid, circleid, startedFollowing ) values(?, ?, ? )');
    client.execute(query2, [follower.mailboxId, follower.circleId, startedFollowing], (err2, result2) => {
      if (err2) { throw err2; }
      return callback(err2, follower);
    });
  });
}


function checkIfFollowExists(follower, callback) {
  const query = (`SELECT * from mailboxesFollowingCircle where circleid = ${follower.circleId}
   AND mailboxid = ${follower.mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(null, result.rowLength > 0);
  });
}

function deleteFollow(follower, callback) {
  const query = (`DELETE FROM mailboxesFollowingCircle where circleId = ${follower.circleId} AND mailboxId = ${follower.mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { throw err; }
    const query2 = (`DELETE FROM circlesFollowedByMailbox where circleId = ${follower.circleId} AND mailboxId = ${follower.mailboxId}`);
    client.execute(query2, (err2, result2) => {
      if (err2) { throw err2; }
      return callback(err2, follower);
    });
  });
}

function splitMailId(circleId, callback) {
  const query = (`SELECT * from follow where circleid = ${circleId}`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(null, result.rows);
  });
}

function getFollowersMailboxesOfACircle(circleId, limit, callback){
   if (limit == 0) {
    return callback("limit is set to 0", null);
    return;
  }

  else if (limit == -1) {
    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      return callback(null, result);
    });
    return;
  }

  const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} limit ${limit}`);
  client.execute(query, (err,result) => {
    if (err) { throw err; }
    return callback(err, result);
  });
}

module.exports = {
  deleteFollow,
  addFollow,
  checkIfFollowExists,
  splitMailId,
  getFollowersMailboxesOfACircle,

};
