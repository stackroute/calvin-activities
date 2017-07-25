const config = require('../config');
const start = require('../client/dse');

const client = start.client;

function addFollow(follower, startedFollowing, callback) {
  const query = ('INSERT INTO mailboxesFollowingCircle (circleid, mailboxid, startedFollowing ) values(?, ?, ? )');
  client.execute(query, [follower.circleId.toString(), follower.mailboxId.toString(), startedFollowing], (err, result) => {
    if (err) {
      throw err;
    }
    const query2 = ('INSERT INTO circlesFollowedByMailbox (mailboxid, circleid, startedFollowing ) values(?, ?, ? )');
    client.execute(query2, [follower.mailboxId.toString(), follower.circleId.toString(), startedFollowing], (err2, result2) => {
      if (err2) {
        throw err2;
      }
      return callback(err2, follower);
    });
  });
}


function checkIfFollowExists(follower, callback) {
  const query = (`SELECT * from mailboxesFollowingCircle where circleid = ${follower.circleId}
   AND mailboxid = ${follower.mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) {
      return callback(err);
    }
    return callback(null, result.rowLength > 0);
  });
}

function deleteFollow(follower, callback) {
  const query = (`DELETE FROM mailboxesFollowingCircle where circleId = ${follower.circleId} AND mailboxId = ${follower.mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) {
      throw err;
    }
    const query2 = (`DELETE FROM circlesFollowedByMailbox where circleId = ${follower.circleId} AND mailboxId = ${follower.mailboxId}`);
    client.execute(query2, (err2, result2) => {
      if (err2) {
        throw err2;
      }
      return callback(err2, follower);
    });
  });
}

function getFollowersMailboxesOfACircle(circleId, limit, before, after, callback) {
  const config = require('../../../config');
  if (limit == 0) {
    return callback("limit is set to 0", null);
    return;
  } else if (limit == -1 && before != undefined && after == undefined) {
    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} and mailboxId < ${before}`);
    client.execute(query, (error, result) => {
      if (error) {
        return callback(error, null);
      }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, {
        a,
        b
      });
    });
  } else if (limit == -1 && after != undefined && before == undefined) {
    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} and mailboxId > ${after}`);
    client.execute(query, (error, result) => {
      if (error) {
        return callback(error, null);
      }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, {
        a,
        b
      });
    });
  } else if (limit == -1 && after != undefined && before != undefined) {
    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} and mailboxId < ${before} and mailboxId > ${after}`);
    client.execute(query, (error, result) => {
      if (error) {
        return callback(error, null);
      }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, {
        a,
        b
      });
    });
  } else if (limit == -1 && after == undefined && before == undefined) {
    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId}`);
    client.execute(query, (error, result) => {
      if (error) {
        return callback(error, null);
      }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, {
        a,
        b
      });
    });
  } else if (limit == undefined && before != undefined && after == undefined) {
    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} and mailboxId < ${before} limit ${defaultLimit}`);
    client.execute(query, (error, result) => {
      if (error) {
        return callback(error, null);
      }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, {
        a,
        b
      });
    });
  } else if (limit == undefined && after != undefined && before == undefined) {

    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} and mailboxId > ${after} limit ${defaultLimit}`);
    client.execute(query, (error, result) => {
      if (error) {
        return callback(error, null);
      }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, {
        a,
        b
      });
    });
  } else if (limit == undefined && after != undefined && before != undefined) {

    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} and mailboxId < ${before} and mailboxId > ${after} limit ${defaultLimit}`);
    client.execute(query, (error, result) => {
      if (error) {
        return callback(error, null);
      }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, {
        a,
        b
      });
    });
  } else if (limit == undefined && after == undefined && before == undefined) {

    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} limit ${defaultLimit}`);
    client.execute(query, (error, result) => {
      if (error) {
        return callback(error, null);
      }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, {
        a,
        b
      });
    });
  }



  // limit != undefined
  else if (limit != undefined && before != undefined && after == undefined) {

    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} and mailboxId < ${before} limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) {
        return callback(error, null);
      }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, {
        a,
        b
      });
    });
  } else if (limit != undefined && after != undefined && before == undefined) {


    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} and mailboxId > ${after} limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) {
        return callback(error, null);
      }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, {
        a,
        b
      });
    });
  } else if (limit != undefined && after != undefined && before != undefined) {


    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} and mailboxId < ${before} and mailboxId > ${after} limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) {
        return callback(error, null);
      }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, {
        a,
        b
      });
    });
  } else if (limit != undefined && after == undefined && before == undefined) {

    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) {
        return callback(error, null);
      }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, {
        a,
        b
      });
    });
  }
}


module.exports = {
  deleteFollow,
  addFollow,
  checkIfFollowExists,
  getFollowersMailboxesOfACircle,
};