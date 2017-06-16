const publishDao = require('../../dao/publish');
const followDao = require('../../dao/follow');


function createPublishActivityCircle(req, res) {
  console.log(`Inside controller followDao${followDao.followapi}`);
  res.status(201).json(publishDao.createPublishActivityCircle(req, res));
}

function createPublishActivityMailbox(req, res) {
  // console.log("Inside controller");
  res.status(201).json(publishDao.createPublishActivityMailbox(req, res));
}

function getPublishActivityCircle(req, res) {
  const id = req.params.circleId;
  // console.log("req.param.id"+id);
  //   console.log("Inside controller getpublish");
  const getResult = publishDao.getPublishActivityCircle(id);
  // console.log('getresult'+getResult);
  if (getResult === undefined) {
    res.status(404).send();
  }
  res.status(200).json(getResult);
}

function getPublishActivityMailbox(req, res) {
  const id = req.params.mailboxId;
  //  console.log("Inside controller");
  const getResult = publishDao.getPublishActivityMailbox(id);
  if (getResult === undefined) {
    res.status(404).send();
  }
  res.status(200).json(getResult);
}

module.exports = {
  createPublishActivityCircle,
  createPublishActivityMailbox,
  getPublishActivityCircle,
  getPublishActivityMailbox,
};
