const activityDao = require('../../dao/').activity;
const circleDAO = require('../../dao').circle;
const mailboxDAO = require('../../dao').mailbox;

// Publish to circle and followers mailbox
function createPublishActivity(req, res) {
  const receiver = req.params.circleId;
  const newActivity = {
    payload: req.body,
  };
  newActivity.payload.createdAt = new Date();
  circleDAO.checkIfCircleExists(receiver, (data, circleExists) => {
    if (!circleExists) { res.status(404).json({ message: 'Circle Id does not exists' }); return; }
    activityDao.createPublishActivity(receiver, newActivity, (error1) => {
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
  };
  newActivity.payload.createdAt = new Date();
  mailboxDAO.checkIfMailboxExists(receiver, (data, mailboxExists) => {
    if (!mailboxExists) { res.status(404).send('Mailbox Id does not exists'); return; }
    activityDao.publishToMailbox(receiver, newActivity, (error, result) => {
      if (error) { res.status(404).json({ message: `${error}` }); return; }
      res.status(201).json(result);
    });
  });
}


function getAllActivities(req, res) {
  const mailboxId = req.params.mailboxId;
  const limit = req.query.limit;
  const before = req.query.before;
  const after = req.query.after;
  activityDao.retriveMessageFromMailbox(mailboxId, before, after, limit, (err, result) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    const firstActivity = (result.a !== 0) ? result.b[0] : [];
    const lastActivity = (result.a !== 0) ? result.b[result.b.length - 1] : [];
    res.status(200).json({
      totalItems: result.a,
      items: result.b,
      first: firstActivity,
      last: lastActivity,
    });
  });
}


module.exports = {
  createPublishActivity,
  createPublishActivityToMailbox,
  getAllActivities,
};
