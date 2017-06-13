const dao = require('../../dao/follow/index.js');

const circle = [];
let id = 0;

function follow(req, res) {
  const circleId=req.params.circleId;
  const mailboxId=req.params.mailboxId;

  if (!dao.checkIfCircleExists(circleId)) {
    res.status(404).json({ message: `Circle with id ${circleId} does not exist` });
    return;
  }

  if (!dao.checkIfMailboxExists(mailboxId)) {
    res.status(404).json({ message: `Mailbox with id ${mailboxId} does not exist` });
    return;
  }

  if (dao.checkIfFollowExists(circleId, mailboxId)) {
    res.status(409).json({ message: 'Follow already exists' });
    return;
  }
  const data=dao.addFollow(circleId, mailboxId);
  res.status(201).json(data);
}
function unfollow(req, res) {
  const circleId=parseInt(req.params.circleId);
  const mailboxId=parseInt(req.params.mailboxId);
  const checkFollow = dao.checkIfFollowExists(circleId, mailboxId);
  if (checkFollow === false) {
    res.status(404).send('follower does not exist');
  } else {
    const result = dao.deconsteFollow(circleId, mailboxId);
    res.status(200).json(result);
  }
}
function retrieveAllCircles(req, res) {
  res.status(200).json(circle);
}
function createNewCircle(req, res) {
  const newcircle = {
    id: id += 1,
  };
  circle.push(newcircle);
  res.status(201).json(newcircle);
}
function deconsteCircle(req, res) {
  id = +req.params.id;
  const filteredCircle = circle.filter(circles => circles.id === id);
  if (filteredCircle.length === 0) { res.status(404).send(); return; }

  const index = circle.indexOf(filteredCircle[0]);
  circle.splice(index, 1);
  res.status(200).json(filteredCircle[0]);
}

module.exports = {
  retrieveAllCircles, createNewCircle, deconsteCircle, follow, unfollow,
};
