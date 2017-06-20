const circleDAO = require('../../dao/circle');

function createCircle(req, res) {
  res.status(201).json(circleDAO.createCircle());
}
// function createCircle(req, res) {
//   circleDAO.createCircle((err, id) => {
//     if (err) { res.status(500).json({ message: `${err}` }); return; }
//     res.status(201).json(id);
//   });
// }


function deleteCircle(req, res) {
  const CircleExist = circleDAO.checkIfCircleExists(req.params.circleId);
  if (CircleExist) {
    const result = circleDAO.deleteCircle(req.params.circleId);
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: `Circle id ${req.params.circleId} does not exist` });
  }
}

module.exports = {
  createCircle, deleteCircle,
};


// Async DAO

// const circleDAO = require('../../dao_mock/circle');
// const followDAO = require('../../dao/follow/');
// const mailboxDAO= require('../../dao/mailbox/');

// const async= require('async');

// function createCircle(req, res) {
//   circleDAO.createCircle((err, id) => {
//     if (err) { res.status(500).json({ message: `${err}` }); return; }
//     res.status(201).json(id);
//   });
// }

// function deleteCircle(req, res) {
//   circleDAO.deleteCircle(req.params.circleId, (err, id) => {
//     if (err) { res.status(404).json({ message: `${err}` }); return; }
//     res.status(200).json(id);
//   });
// }


// module.exports = {
//   createCircle, deleteCircle,
// };
