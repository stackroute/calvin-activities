const circleDAO = require('../../dao').circle;
const followDAO = require('../../dao/').follow;
const mailboxDAO = require('../../dao/').mailbox;

function follow(req, res) {
  const circleId = req.params.circleId;
  const mailboxId = req.params.mailboxId;
  const startFollowing = new Date();

  mailboxDAO.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
    // console.log(1);
    if (err) { res.status(404).json({ message: `${err}` }); return; }
    const isMailboxExists = doesMailboxExists;

    circleDAO.checkIfCircleExists(circleId, (err1, doesCircleExists) => {
      // console.log(2);
      if (err1) { res.status(404).json({ message: `${err1}` }); return; }
      const isCircleExists = doesCircleExists;

      followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, isExists) => {
        // console.log(3);
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
          // console.log(4);
          res.status(201).json(data);
        });
      });
    });
  });
}
function unfollow(req, res) {
  const circleId = req.params.circleId;
   const mailboxId = req.params.mailboxId;

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

        if (!isFollowExists) {
          res.status(404).json({ message: 'Link does not exists' });
          return;
        }

        followDAO.deleteFollow({ circleId, mailboxId }, (err3, data) => {
          if (err) { res.status(500).json({ message: ` ${err3}` }); }
          res.status(200).json(data);
        });
      });
    });
  });
}

   function getFollowersMailboxesOfACircle(req, res) {
  followDAO.getFollowersMailboxesOfACircle(req.params.circleId, req.query.limit,req.query.before, req.query.after, (err, result) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(200).json({totalItems: result.a, items: result.b});
  });
}


module.exports = {
  follow, unfollow, getFollowersMailboxesOfACircle,
};
