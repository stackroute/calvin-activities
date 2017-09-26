const start = require('../../../db');
const config = require('../../../config');

const client = start.client;
const kafkaPipeline = require('kafka-pipeline');

function addFollow(follower, startedFollowing, callback) {
  const query = ('INSERT INTO mailboxesFollowingCircle (circleid, mailboxid, startedFollowing ) values(?, ?, ? )');
  client.execute(query, [follower.circleId, follower.mailboxId, startedFollowing], (err) => {
    if (err) {
      throw err;
    }
    const query2 = ('INSERT INTO circlesFollowedByMailbox (mailboxid, circleid, startedFollowing ) values(?, ?, ? )');
    client.execute(query2, [follower.mailboxId, follower.circleId, startedFollowing], (err2) => {
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
  const query =
  `DELETE FROM mailboxesFollowingCircle where circleId=${follower.circleId} AND mailboxId=${follower.mailboxId}`;
  client.execute(query, (err) => {
    if (err) {
      throw err;
    }
    const query2 =
    `DELETE FROM circlesFollowedByMailbox where circleId=${follower.circleId} AND mailboxId=${follower.mailboxId}`;
    client.execute(query2, (err2) => {
      if (err2) {
        throw err2;
      }
      console.log('SENDING MESSAGE TO ROUTES');
      kafkaPipeline.producer.ready(() => {
        console.log('ROUTES_TOPIC:', config.kafka.routesTopic);
        kafkaPipeline.producer.send([{
          topic: config.kafka.routesTopic,
          messages: JSON.stringify({
            circleId: follower.circleId,
            mailboxId: follower.mailboxId,
            command: 'removeRoute',
          })
        }]);
        return callback(null, follower);
      });
    });
  });
}

function getFollowersMailboxesOfACircle(circleId, limit, before, after, callback) {
  if (limit === 0) {
    callback('limit is set to 0', null);
  } else if (limit === undefined && before !== undefined && after === undefined) {
    const defaultLimit = config.defaultLimit;
    const query =
    `SELECT * from mailboxesFollowingCircle where circleId=${circleId} and mailboxId<${before} limit ${defaultLimit}`;
    client.execute(query, (error, result) => {
      if (error) {
        callback(error, null); return;
      }
      const a = result.rows.length;
      const b = result.rows;
      callback(null, {
        a,
        b,
      });
    });
  } else if (limit === undefined && after !== undefined && before === undefined) {
    const defaultLimit = config.defaultLimit;
    const query =
    `SELECT * from mailboxesFollowingCircle where circleId=${circleId} and mailboxId>${after} limit ${defaultLimit}`;
    client.execute(query, (error, result) => {
      if (error) {
        callback(error, null); return;
      }
      const a = result.rows.length;
      const b = result.rows;
      callback(null, {
        a,
        b,
      });
    });
  } else if (limit === undefined && after === undefined && before === undefined) {
    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} limit ${defaultLimit}`);
    client.execute(query, (error, result) => {
      if (error) {
        callback(error, null); return;
      }
      const a = result.rows.length;
      const b = result.rows;
      callback(null, {
        a,
        b,
      });
    });
  } else if (limit !== undefined && before !== undefined && after === undefined) {
    const query =
    `SELECT * from mailboxesFollowingCircle where circleId=${circleId} and mailboxId<${before} limit ${limit}`;
    client.execute(query, (error, result) => {
      if (error) {
        callback(error, null); return;
      }
      const a = result.rows.length;
      const b = result.rows;
      callback(null, {
        a,
        b,
      });
    });
  } else if (limit !== undefined && after !== undefined && before === undefined) {
    const query =
    `SELECT * from mailboxesFollowingCircle where circleId=${circleId} and mailboxId>${after} limit ${limit}`;
    client.execute(query, (error, result) => {
      if (error) {
        callback(error, null); return;
      }
      const a = result.rows.length;
      const b = result.rows;
      callback(null, {
        a,
        b,
      });
    });
  } else if (limit !== undefined && after === undefined && before === undefined) {
    const query = (`SELECT * from mailboxesFollowingCircle where circleId = ${circleId} limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) {
        callback(error, null); return;
      }
      const a = result.rows.length;
      const b = result.rows;
      callback(null, {
        a,
        b,
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
