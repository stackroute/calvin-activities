const start = require('../../../db');
const activityDAO = require('../../index').activity;
const followDAO = require('../../index').follow;
const circleDAO = require('../../index').circle;

function getAllCircles(callback) {
  circleDAO.getAllCircles((error, result) => {
    if (error) { return callback(err); }
    return callback(err, result);
  });
}


// module.exports = {
//   getOpenMailboxes,
//   getAllCircles,
//   getAllFollowersOfACircle,
// };

module.exports = {
  getAllCircles,
};
