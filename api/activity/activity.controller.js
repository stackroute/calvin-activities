const activityDao = require('../../dao').activity;
const followDao = require('../../dao').follow;
const circleDAO = require('../../dao').circle;

function createPublishActivity(req, res) {
  const payload = req.body;
  const receiver = req.params.circleId;
  const newActivity = {
    payload: req.body,
    timestamp: new Date(),
  };
  circleDAO.checkIfCircleExists(receiver, (data, circleExists) => {
    if (!circleExists) { res.status(404).send('Circle Id does not exists'); return; }
    activityDao.createPublishActivity(receiver, newActivity, (error1, data1) => {
      if (error1) { res.status(404).json(error1); return; }
      res.status(201).json(data1);
    });
  });
}


function getActivity(req, res) {
  const mailId = req.params.mailboxId;
  activityDao.retriveMessageFromMailbox(mailId, (err, result) => {
    if (err) {
      res.status(404).json([]); return;
    }
    res.json(result);
  });
  return null;
}


module.exports = {
  createPublishActivity,
  getActivity,
};
