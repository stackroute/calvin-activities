const circleDAO = require('../../dao/circle');
const followDAO = require('../../dao/follow/');
const mailboxDAO= require('../../dao/mailbox/');


function follow(req, res) {
  const { circleId, mailboxId } = req.params;
  let isMailboxExists = true;
  let isCircleExists = true;
  const isFollowExists = true;
  mailboxDAO.checkIfMailboxExists(mailboxId, (err, isExists) => {
    if (err) { res.status(404).json(err); return; }
    isMailboxExists=isExists;
  });
  circleDAO.checkIfCircleExists(circleId, (err, isExists) => {
    if (err) { res.status(404).json(err); return; }
    isCircleExists=isExists;
  });
  followDAO.checkIfFollowExists({ circleId, mailboxId }, (err, isExists) => {
    if (err) { res.status(404).json(err); return; }
    isMailboxExists=isExists;
  });
  if (!isMailboxExists) {
    res.status(404).json({ message: `Mailbox with id ${mailboxId} does not exist` });
    return;
  }
  if (!isCircleExists) {
    res.status(404).json({ message: `Circle with id ${circleId} does not exist` });
    return;
  }
  if (isFollowExists) {
    res.status(404).json({ message: 'Link does not exists' });
    return;
  }
  followDAO.addFollow({ circleId, mailboxId }, (err, data) => {
    res.status(201).json(data);
  });
}

function unfollow(req, res) {
  const { circleId, mailboxId } = req.params;
  let isMailboxExists = true;
  let isCircleExists = true;
  const isFollowExists = true;
  mailboxDAO.checkIfMailboxExists(mailboxId, (err, isExists) => {
    if (err) { res.status(404).json(err); return; }
    isMailboxExists=isExists;
  });
  circleDAO.checkIfCircleExists(circleId, (err, isExists) => {
    if (err) { res.status(404).json(err); return; }
    isCircleExists=isExists;
  });
  followDAO.checkIfFollowExists({ circleId, mailboxId }, (err, isExists) => {
    if (err) { res.status(404).json(err); return; }
    isMailboxExists=isExists;
  });
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
  followDAO.deleteFollow({ circleId, mailboxId }, (err, result) => {
    res.status(200).json(result);
  });
}

module.exports = {
  follow, unfollow,
};
