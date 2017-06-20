const activityDao = require('../../dao/activity');
const followDao = require('../../dao/follow');


function createPublishActivity(req, res) {
  const payload = req.body;
  const receiver = req.params.circleId;
  const newActivity = {
    payload: req.body,
    timestamp: new Date(),
  };
  // res.status(201).json(activityDao.createPublishActivity(receiver, newActivity));
  activityDao.createPublishActivity(receiver, newActivity, (err, data) => {
    if (err) { res.status(404).json(err); return; }
    res.status(201).json(data);
  });
}


function getActivity(req, res) {
  const mailId = req.params.mailboxId;
  activityDao.retriveMessageFromMailbox(mailId, (err, result) => {
    if (err) {
      return res.status(404).json([]);
    } else {
      res.json(result);
    }
    return null;
  });
}


module.exports = {
  createPublishActivity,
  getActivity,
};
