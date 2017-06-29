const activityDAO = require('../../index').activity;
const followDAO = require('../../index').follow;
const circleDAO = require('../../index').circle;

function getOpenMailboxes(range, callback) {
  const offset = parseInt(range.offset);
  const count = parseInt(range.count);
  const users = (Object.keys(activityDAO.listeners)).slice(offset, (offset+count));
  return callback(null, users);
}

function getAllCircles(range, callback) {
  const offset = parseInt(range.offset);
  const count = parseInt(range.count);

  const circles = (circleDAO.circles).map(circle => circle.id)
    .slice(offset, (offset+count));
  return callback(null, circles);
}

function getAllFollowersOfACircle(circleId, range, callback) {
  const offset = parseInt(range.offset);
  const count = parseInt(range.count);
  const followers = (followDAO.followapi).filter(follow => follow.circleId === circleId)
    .map(filteredFollower => filteredFollower.mailboxId)
    .slice(offset, (offset+count));
  callback(null, followers);
}

module.exports = {
  getOpenMailboxes,
  getAllCircles,
  getAllFollowersOfACircle,
};
