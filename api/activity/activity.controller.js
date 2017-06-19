const activityDao = require('../../dao/activity');
const followDao = require('../../dao/follow');


function createPublishActivity(req, res) {
  const payload = req.body;
  const receiver = req.params.circleId;
  const newActivity = {
    payload: req.body,
    timestamp: new Date(),
  };
  res.status(201).json(activityDao.createPublishActivity(receiver, newActivity));
}

function getActivity(req, res) {
  const mailId = req.params.mailboxId;
  const isMailboxPresent = activityDao.retriveMessageFromMailbox(mailId);
  if (isMailboxPresent) {
    res.json(activityDao.retriveMessageFromMailbox(mailId));
  } else {
    res.status(404).json([]);
  }
}


module.exports = {
  createPublishActivity,
  getActivity,
};
