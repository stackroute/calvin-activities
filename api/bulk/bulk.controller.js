const bulkDao = require('../../dao').bulk;
const circleDAO = require('../../dao').circle;

function getOpenMailboxes(req, res) {
  const offset = req.params.offset;
  const count = req.params.count;
  bulkDao.getOpenMailboxes({ offset, count }, (err, users) => {
    if (err) { res.status(404).json({ message: `${err}` }); return; }
    if (!users.record_count) { res.status(404).json({ message: 'Not found' }); return; }
    res.status(200).json({ users });
  });
}

function getAllCircles(req, res) {
  const offset = req.params.offset;
  const count = req.params.count;
  bulkDao.getAllCircles({ offset, count }, (err, circles) => {
    if (err) { res.status(404).json({ message: `${err}` }); return; }
    if (!circles.record_count) { res.status(404).json({ message: 'Not found' }); return; }
    res.status(200).json({ circles });
  });
}

function getAllFollowersOfACircle(req, res) {
  const circleId = req.params.circleid;
  const offset = req.params.offset;
  const count = req.params.count;
  circleDAO.checkIfCircleExists(circleId, (error, doesCircleExists) => {
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesCircleExists) { res.status(404).json({ message: `Circle with id ${circleId} does not exist` }); return; }

    bulkDao.getAllFollowersOfACircle(circleId, { offset, count }, (err, followers) => {
      if (err) { res.status(404).json({ message: `${err}` }); return; }
      if (!followers.record_count) { res.status(404).json({ message: 'Not found' }); return; }
      res.status(200).json({ followers });
    });
  });
}

module.exports = {
  getOpenMailboxes,
  getAllCircles,
  getAllFollowersOfACircle,
};
