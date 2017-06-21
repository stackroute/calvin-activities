const followapi = [];
function addFollow(follower, callback) {
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
}
module.exports = {
  deleteFollow,
  addFollow,
  checkIfFollowExists,
};

function splitMailId(circleId) {
  const splitMailIdd = followapi.filter(y => y.circleId === circleId);

  return splitMailIdd;
}

module.exports = {
  deleteFollow,
  addFollow,
  checkIfFollowExists,
  splitMailId,
};
