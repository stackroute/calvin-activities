const bulkDao = require('../../dao').bulk;
const circleDAO = require('../../dao').circle;
const mailboxDAO = require('../../dao').mailbox;

function getOnlineUsers(req, res) {
  const offset = req.params.offset;
  const count = req.params.count;
  bulkDao.getUsersOnline({ offset, count }, (err, users) => {
    if (err) { res.status(404).json([]); return; }
    res.json(users);
  });
}

function getAllCircles(req, res) {
  const offset = req.params.offset;
  const count = req.params.count;
  bulkDao.getAllCircles({ offset, count }, (err, users) => {
    if (err) { res.status(404).json([]); return; }
    res.json(users);
  });
}

function getAllFollowersOfACircle(req, res) {
  const circleId = req.params.circleid;
  const offset = req.params.offset;
  const count = req.params.count;
  bulkDao.getAllFollowersOfACircle({ circleId, offset, count }, (err, users) => {
    if (err) { res.status(404).json([]); return; }
    res.json(users);
  });
}

module.exports = {
  getOnlineUsers,
  getAllCircles,
  getAllFollowersOfACircle,
};
