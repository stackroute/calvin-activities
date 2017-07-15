const followapi = [];

function addFollow(follower, startedFollowing, callback) {
  followapi.push(follower.circleId, follower.mailboxId, startedFollowing);
  console.log('dao'); console.log(followapi);
  return callback(null, follower);
}


function checkIfFollowExists(follower, callback) {
  console.log('=============================');
  console.log(followapi);
  console.log(follower);
  console.log('=============================');
  const filterData = follow => follow.circleId === follower.circleId && follow.mailboxId === follower.mailboxId;
  const filteredFollowers = followapi.filter(filterData);
  console.log(filteredFollowers);
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

module.exports = {
  deleteFollow,
  addFollow,
  checkIfFollowExists,
  splitMailId,
  followapi,
};
