const followapi = [];

const result = [];

const config = require('../../../config');

function addFollow(follower, startedFollowing, callback) {
  const followers = {
    circleId: follower.circleId,
    mailboxId: follower.mailboxId,
    startedFollowing: startedFollowing
  }
  followapi.push(followers);
  return callback(null, follower);
}


function checkIfFollowExists(follower, callback) {
  const filterData = follow => follow.circleId === follower.circleId && follow.mailboxId === follower.mailboxId;
  const filteredFollowers = followapi.filter(filterData);
  return callback(null, filteredFollowers.length > 0);
}
function deleteFollow(follower, callback) {
  const filter = followapi.filter(y => y.circleId === follower.circleId && y.mailboxId === follower.mailboxId);
  followapi.splice(followapi.indexOf(filter[0]), 1);
  return callback(null, filter[0]);
}

function splitMailId(circleId, callback) {
  const splitMailIdd = followapi.filter(y => y.circleId === circleId);
  return callback(null, splitMailIdd);
}

function getFollowersMailboxesOfACircle(circleId, limit, callback) {
  const filterData = follow => follow.circleId === circleId;
  const result = followapi.filter(filterData);
  if (limit == 0) {
    return callback("limit is set to 0", null);
    return;
  }

  else if (limit === -1) {
    let a = followapi.length;
    let b = followapi;
    return callback(null, { a, b });
  }

  else if (limit === undefined) {
    const defaultLimit = config.defaultLimit;
    for (let i = 0; i < limit; i++) {
      result.push(followapi[i]);
    }
    let a = result.length;
    let b = result;
    return callback(null, { a, b });
  }

  else {
    for (let i = 0; i < limit; i++) {
      result.push(followapi[i]);
    }
    let a = result.length;
    let b = result;
    return callback(null, { a, b });
  }
}


module.exports = {
  deleteFollow,
  addFollow,
  checkIfFollowExists,
  splitMailId,
  getFollowersMailboxesOfACircle,
};
