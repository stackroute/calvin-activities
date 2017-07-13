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


module.export = {
  getOpenMailboxes,
}