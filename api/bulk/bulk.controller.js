const circleDAO = require('../../dao').circle;
const followDAO = require('../../dao').follow;
const activityDAO = require('../../dao').activity;
const bulkDAO = require('../../dao').bulk;

function getOpenMailboxes(req, res) {
  const offset = req.params.offset;
  const count = req.params.count;
  bulkDao.getOpenMailboxes({ offset, count }, (err, users) => {
    if (err) { res.status(404).json({ message: `${err}` }); return; }
    if (!users.record_count) { res.status(404).json({ message: 'Not found' }); return; }
    res.status(200).json({ users });
  });
}

function bulkFollow(req, res) {
    console.log("bulk follow");
  follower = req.body;
  circleId = req.params.circleId;
  startFollowing = new Date();
//   let a = follower.id;
  // a.forEach(function (mailboxId) {
  //   mailboxDAO.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
  //     if (err) { res.status(404).json({ message: `${err}` }); return; }
  //     const isMailboxExists = doesMailboxExists;

  //     circleDAO.checkIfCircleExists(circleId, (err1, doesCircleExists) => {
  //       if (err1) { res.status(404).json({ message: `${err1}` }); return; }
  //       const isCircleExists = doesCircleExists;

  //       followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, isExists) => {
  //         if (err2) { res.status(404).json({ message: `${err2}` }); return; }
  //         const isFollowExists = isExists;
  //         if (!isMailboxExists) {
  //           res.status(404).json({ message: `Mailbox with id ${mailboxId} does not exist` });
  //           return;
  //         }

  //         if (!isCircleExists) {
  //           res.status(404).json({ message: `Circle with id ${circleId} does not exist` });
  //           return;
  //         }

  //         if (isFollowExists) {
  //           res.status(409).json({ message: `Mailbox ${mailboxId} is already following ${circleId}` });
  //           return;
  //         }

  //         followDAO.addFollow({ circleId, mailboxId }, startFollowing, (err3, data) => {
  //           res.status(201).json(data);
  //         });
  //       });
  //     });
  //   });
  // });
}

module.exports = {
    getOpenMailboxes,
    bulkFollow,
};
