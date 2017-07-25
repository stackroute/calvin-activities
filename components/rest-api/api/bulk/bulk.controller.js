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
  const circleId = req.params.circleId;
  const result = req.body.mailboxIds;
  if(result && result.length > 0){
    circleDAO.checkIfCircleExists(circleId, (err1, doesCircleExists) => {
      if (err1) { res.status(404).json({ message: `${err1}` }); return; }
      if (!doesCircleExists) {
        res.status(404).json({ message: `Circle with id ${circleId} does not exist` });
        return;
      }
      for (let i = 0; i <= result.length - 1; i += 1) {
        const mailboxId = (result[i]);
        const startFollowing = new Date();
        mailboxDAO.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
          if (err) { res.status(404).json({ message: `${err}` }); return; }
          const isMailboxExists = doesMailboxExists;
          if(isMailboxExists){
            followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, isExists) => {
              if (err2) { res.status(404).json({ message: `${err2}` }); return; }
              const isFollowExists = isExists;
              if(!isFollowExists){
                followDAO.addFollow({ circleId, mailboxId }, startFollowing, (err3, data) => {
                  if (err3) { throw err3; }
                });
              }
            });
          }
        });
      }
      res.status(200).json({ message: 'Added followers' });
    });
  }
}

function getAllCirclesFollowedByMailbox(req, res) {
  const mailboxId = req.params.mailboxId;
     bulkDAO .getAllCircles(mailboxId, (err, circles) => {
      if (err) { res.status(404).json({err}); return; }
      res.status(200).json({ items:circles.a, totalitems:circles.b} );
    });
}


module.exports = {
  getOpenMailboxes,
  bulkFollow,
  getAllCirclesFollowedByMailbox
};
