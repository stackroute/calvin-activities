const followapi = [];

function retrieveAlldata(req, res) {
  res.status(200).json(followapi);
}

function getCircleName(req, res) {
  const mid = req.params.mid;
  const filterCircles = followapi.filter(x => x.mid === mid);
  if (filterCircles.length === 0) {
    res.status(404).send(); return;
  }
  res.status(200).json(filterCircles);
}

function getMailboxId(req, res) {
  const cid = req.params.cid;
  const filteredMailboxes = followapi.filter(x => x.cid === cid);
  if (filteredMailboxes.length === 0) {
    res.status(404).send(); return;
  }
  res.status(200).json(filteredMailboxes);
}


function createNewuser(req, res) {
  const newuser = {
    cid: req.body.cid,
    mid: req.body.mid,
  };
  followapi.push(newuser);
  res.status(201).json(newuser);
}

function unfollow(req, res) {
  const filterCircle = followapi.filter(y => y.cid === req.params.cid && y.mid === req.params.mid);

  if (filterCircle.length === 0) {
    res.status(404).send(); return;
  }
  const index = followapi.indexOf(filterCircle[0]);
  followapi.splice(index, 1);
  res.send('deleted');
}

module.exports = {
  retrieveAlldata,
  getCircleName,
  createNewuser,
  getMailboxId,
  unfollow,
};

