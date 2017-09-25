const activityDAO = require('../../index').activity;

function getOpenMailboxes(range, callback) {
  console.log('In mock');
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


function getAllActivitiesOfACircle(circleId, range, callback) {
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
  getAllActivitiesOfACircle,
};
