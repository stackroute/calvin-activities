const dao = require('../../dao/follow/index.js');

function follow(req, res) {
  const checkFollow = dao.checkIfFollowExists(req.params.circleId, req.params.mailboxId);
  if (checkFollow === true) {
    res.status(405).send('User already Exists');
  } else {
    const result = dao.addFollow(req.params.circleId, req.params.mailboxId);
    res.status(201).json(result);
  }
}
function unfollow(req, res) {
  const checkFollow = dao.checkIfFollowExists(req.params.circleId, req.params.mailboxId);
  if (checkFollow === false) {
    res.status(404).send('follower does not exist');
  } else {
    const result = dao.deleteFollow(req.params.circleId, req.params.mailboxId);
    res.status(200).json(result);
  }
}

module.exports = {
  follow,
  unfollow,
};

