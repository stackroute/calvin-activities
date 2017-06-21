const circleDAO = require('../../dao').circle;
const followDAO = require('../../dao/').follow;
const mailboxDAO= require('../../dao/').mailbox;

function follow(req, res) {
  const { circleId, mailboxId } = req.params;
  console.log();
  mailboxDAO.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
    if (err) { res.status(404).json(err); return; }
    const isMailboxExists=doesMailboxExists;
    circleDAO.checkIfCircleExists(circleId, (err1, doesCircleExists) => {
      if (err1) { res.status(404).json(err1); return; }
      const isCircleExists=doesCircleExists;
      followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, isExists) => {
        if (err2) { res.status(404).json(err2); return; }
        const isFollowExists=isExists;
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
        followDAO.addFollow({ circleId, mailboxId }, (err3, data) => {
          res.status(201).json(data);
        });
      });
    });
  });
}
function unfollow(req, res) {
  const { circleId, mailboxId } = req.params;
  mailboxDAO.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
    if (err) { res.status(404).json(err); return; }
    const isMailboxExists=doesMailboxExists;
    circleDAO.checkIfCircleExists(circleId, (err1, doesCircleExists) => {
      if (err1) { res.status(404).json(err1); return; }
      const isCircleExists=doesCircleExists;
      followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, isExists) => {
        if (err2) { res.status(404).json(err2); return; }
        const isFollowExists=isExists;
        if (!isMailboxExists) {
          res.status(404).json({ message: `Mailbox with id ${mailboxId} does not exist` });
          return;
        }
        if (!isCircleExists) {
          res.status(404).json({ message: `Circle with id ${circleId} does not exist` });
          return;
        }
        if (!isFollowExists) {
          res.status(404).json({ message: 'Link does not exists' });
          return;
        }
        followDAO.deleteFollow({ circleId, mailboxId }, (err3, result) => {
          if (err) { res.status(500).json({ message: `Error ${err3}` }); }
          res.status(200).json(result);
        });
      });
    });
  });
}
module.exports = {
  follow, unfollow,
};
