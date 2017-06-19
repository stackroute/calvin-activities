const followapi = [];
// const splitId = [];

function addFollow(follower) {
  followapi.push(follower);
  return follower;
}

function checkIfFollowExists(follower) {
  const filterData = follow => follow.circleId === follower.circleId && follow.mailboxId === follower.mailboxId;
  const filteredFollowers = followapi.filter(filterData);
  return filteredFollowers.length !== 0;
}
function deleteFollow(follower) {
  const filter = followapi.filter(y => y.circleId === follower.circleId && y.mailboxId === follower.mailboxId);
  followapi.splice(followapi.indexOf(filter[0]), 1);
  return filter[0];
}

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
