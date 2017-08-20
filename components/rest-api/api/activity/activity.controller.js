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
  };
  newActivity.payload.createdAt = new Date();
  console.log('in api');
  mailboxDAO.checkIfMailboxExists(receiver, (data, mailboxExists) => {
    if (!mailboxExists) { console.log('no mailbox'); res.status(404).send('Mailbox Id does not exists'); return; }
    activityDao.publishToMailbox(receiver, newActivity, (error1, data1) => {
      console.log('after publish call');
      console.log(error1);
      console.log(data1);
      console.log('out api');
      if (error1) { res.status(404).json({ message: `${error1}` }); return; }
      res.status(201).json(data1);
    });
  });
}


function getAllActivities(req, res) {
  const mailboxId = req.params.mailboxId;
  const limit = req.query.limit;
  const queryObj = req.query;
  console.log(queryObj);
  activityDao.retriveMessageFromMailbox(mailboxId, { queryObj }, limit, (err, result) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    const firstActivity =  (result.a !== 0) ? result.b[0] : [];
    const lastActivity = (result.a !== 0) ? result.b[result.b.length - 1] : [];
    res.status(200).json({totalItems: result.a, items: result.b, first: firstActivity, last: lastActivity});
  });
}


module.exports = {
  createPublishActivity,
  createPublishActivityToMailbox,
  getAllActivities,
};
