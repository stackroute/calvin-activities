const activityDAO = require('../../index').activity;
const followDAO = require('../../index').follow;
const circleDAO = require('../../index').circle;

function getOpenMailboxes(range, callback) {
  const offset = parseInt(range.offset);
  const count = parseInt(range.count);
  const users = (Object.keys(activityDAO.listeners)).slice(offset, (offset+count));
  const response = {
    record_count: users.length,
    total_count: Object.keys(activityDAO.listeners).length,
    records: users,
  };
  return callback(null, response);
}

function getAllCircles(range, callback) {
  const offset = parseInt(range.offset);
  const count = parseInt(range.count);
  const circles = (circleDAO.circles).map(circle => circle.id)
    .slice(offset, (offset+count));
  const response = {
    record_count: circles.length,
    total_count: (circleDAO.circles).length,
    records: circles,
  };
  return callback(null, response);
}

function getAllFollowersOfACircle(circleId, range, callback) {
  const offset = parseInt(range.offset);
  const count = parseInt(range.count);
  const followersObject = (followDAO.followapi).filter(follow => follow.circleId === circleId);
  const followers = followersObject.map(filteredFollower => filteredFollower.mailboxId)
    .slice(offset, (offset+count));
  const response = {
    record_count: followers.length,
    total_count: followersObject.length,
    records: followers,
  };
  callback(null, response);
}

function getAllActivitiesOfACircle(circleId, range, callback) {
  const before=parseInt(range.before);
  const after=parseInt(range.after);
  const limit= parseInt(range.limit);
  const activityObject = (activityDAO.activities).filter(activity => activity.circleId === circleId);
  const activity= activityObject.map(filteredActivity => filteredActivity.mailboxId)
    .slice(after, (after+limit));
  const response = {
    record_count: activity.length,
    total_count: activityObject.length,
    records: activity,
  };

  callback(null, response);
}

module.exports = {
  getOpenMailboxes,
  getAllCircles,
  getAllFollowersOfACircle,
  getAllActivitiesOfACircle,
};
