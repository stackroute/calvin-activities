const activityDAO = require('../../index').activity;
const followDAO = require('../../index').follow;
const circleDAO = require('../../index').circle;

function getUsersOnline(pagination, callback) {
  const users = (Object.keys(activityDAO.listeners)).slice(pagination.offset, (pagination.offset+pagination.count));
  return callback(null, users);
}

function getAllCircles(pagination, callback) {
  const circles = (circleDAO.circles).map(circle => circle.id);
  const paginatedCircles = circles.slice(pagination.offset, (pagination.offset+pagination.count));
  return callback(null, paginatedCircles);
}

function getAllFollowersOfACircle(pagination, callback) {
  const followers = (followDAO.followapi).filter(follow => follow.circleId === pagination.circleId)
    .map(filteredFollower => filteredFollower.mailboxId)
    .slice(pagination.offset, (pagination.offset+pagination.count));
  callback(null, followers);
}

module.exports = {
  getUsersOnline,
  getAllCircles,
  getAllFollowersOfACircle,
};
