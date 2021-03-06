const start = require('../../../db');

const client = start.client;

const activityDAO = require('../../index').activity;

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
function getAllCircles(mailboxId, callback) {
  const query = (`SELECT * from circlesfollowedbymailbox where mailboxId = ${mailboxId}`);
  client.execute(query, [], (error, result) => {
    if (error) {
      return callback(error, null);
    }
    const a = result.rows.length;
    const b = result.rows;
    return callback(null, { a, b });
  });
}


module.exports = {
  getOpenMailboxes,
  getAllCircles,
  getAllActivitiesOfACircle,
};
