const circleDAO = require('../../dao/circle');
const followDAO = require('../../dao/follow/');
const mailboxDAO= require('../../dao/mailbox/');

// const async= require('async');

function createCircle(req, res) {
  circleDAO.createCircle((err, id) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(201).json({ id });
  });
}

function deleteCircle(req, res) {
  // try {
  //   const result= circleDAO.deleteCircle(req.params.circleId);
  //   res.status(200).json(result);
  // } catch (err) {
  //   res.status(500).json({ message: `${err}` });
  // }

  circleDAO.deleteCircle(req.params.circleId, (err, id) => {
    if (err) { res.status(404).json({ message: `${err}` }); return; }
    res.status(200).json({ id });
  });
}


module.exports = {
  createCircle, deleteCircle,
};
