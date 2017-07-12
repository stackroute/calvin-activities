const circleDAO = require('../../dao').circle;
const followDAO = require('../../dao').follow;
const activityDAO = require('../../dao').activity;

function getAllCircles(req, res) {
  circleDAO.getAllCircles((err, result) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    if (result.rows === 0) { res.status(404).json({ message: 'No circles found' }); return; }
    res.status(201).json(result.rows);
  });
}

function getFollowersMailboxesOfACircle(req, res) {
  followDAO.getFollowersMailboxesOfACircle(req.params.circleId, (err, result) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    if (result.rows === 0) { res.status(404).json({ message: 'No followers found' }); return; }
    res.status(201).json(result.rows);
  });
}

function getAllActivities(req, res) {
activityDAO.retriveMessageFromMailbox(req.params.mailboxId,(err,result) =>{
 if (err) { res.status(500).json({ message: `${err}` }); return; }
    if (result === 0) { res.status(404).json({ message: 'No messages found' }); return; }
    res.status(201).json(result);
});
}


module.exports = {
  getAllCircles,
  getFollowersMailboxesOfACircle,
  getAllActivities,
};
