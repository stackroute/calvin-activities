const circleDAO = require('../../dao').circle;
const followDAO = require('../../dao').follow;
const bulkDAO = require('../../dao').bulk;
const mailboxDAO = require('../../dao').mailbox;

function getOpenMailboxes(req, res) {
  const offset = req.params.offset;
  const count = req.params.count;
  bulkDAO.getOpenMailboxes({ offset, count }, (err, users) => {
    if (err) { res.status(404).json({ message: `${err}` }); return; }
    if (!users.record_count) { res.status(404).json({ message: 'Not found' }); return; }
    res.status(200).json({ users });
  });
}

function bulkFollow(req, res) {
  const follower = req.body.id;
  const result = follower.slice(1, follower.length - 1).split(',');
  for (let i = 0; i <= result.length - 1; i += 1) {
    const mailboxId = (result[i]);
    const circleId = req.params.circleId;
    const startFollowing = new Date();
    mailboxDAO.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
      if (err) { res.status(404).json({ message: `${err}` }); return; }
      const isMailboxExists = doesMailboxExists;

      circleDAO.checkIfCircleExists(circleId, (err1, doesCircleExists) => {
        if (err1) { res.status(404).json({ message: `${err1}` }); return; }
        const isCircleExists = doesCircleExists;

        followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, isExists) => {
          if (err2) { res.status(404).json({ message: `${err2}` }); return; }
          const isFollowExists = isExists;
          if (!isMailboxExists) {
            res.status(404).json({ message: `Mailbox with id ${mailboxId} does not exist` });
            return;
          }

          if (!isCircleExists) {
            res.status(404).json({ message: `Circle with id ${circleId} does not exist` });
            return;
          }

          if (isFollowExists) {
            res.status(409).json({ message: `Mailbox ${mailboxId} is already following ${circleId}` });
            return;
          }

          followDAO.addFollow({ circleId, mailboxId }, startFollowing, (err3, data) => {
            if (err3) { throw err3; }
          });
        });
      });
    });
  }
  res.status(200).json({ message: 'Added followers' });
}


module.exports = {
  getOpenMailboxes,
  bulkFollow,
};
