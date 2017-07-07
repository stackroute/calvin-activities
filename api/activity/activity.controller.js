const activityDao = require('../../dao').activity;
const circleDAO = require('../../dao').circle;
const mailboxDAO = require('../../dao').mailbox;

// Publish to circle and followers mailbox
function createPublishActivity(req, res) {
  const receiver = req.params.circleId;
  const newActivity = {
    payload: req.body,
    timestamp: new Date(),
  };

  circleDAO.checkIfCircleExists(receiver, (data, circleExists) => {
    if (!circleExists) { res.status(404).json({ message: 'Circle Id does not exists' }); return; }
    activityDao.createPublishActivity(receiver, newActivity, (error1, data1) => {
      if (error1) { res.status(404).json({ message: `${error1}` }); return; }
      res.status(201).json(newActivity);
    });
  });
}

// Publish to mailbox
function createPublishActivityToMailbox(req, res) {
  const receiver = req.params.mailboxId;
  const newActivity = {
    payload: req.body,
    timestamp: new Date(),
  };
  mailboxDAO.checkIfMailboxExists(receiver, (data, mailboxExists) => {
    if (!mailboxExists) { res.status(404).send('Mailbox Id does not exists'); return; }
    activityDao.publishToMailbox(receiver, newActivity, (error1, data1) => {
      if (error1) { res.status(404).json({ message: `${error1}` }); return; }
      res.status(201).json(data1);
    });
  });
}


function getActivity(req, res) {
  const mailId = req.params.mailboxId;
  //  const offset = req.params.offset;
  // const count = req.params.count;
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
  createPublishActivityToMailbox,
};
