const circleDAO = require('../../dao').circle;

function createCircle(req, res) {
  circleDAO.createCircle((err, id) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(201).json(id);
  });
}
// function createCircle(req, res) {
//   circleDAO.createCircle((err, id) => {
//     if (err) { res.status(500).json({ message: `${err}` }); return; }
//     res.status(201).json(id);
//   });
// }


function deleteCircle(req, res) {
  circleDAO.deleteCircle(req.params.circleId, (err, id) => {
    if (err) { res.status(404).json({ message: `${err}` }); return; }
    res.status(200).json(id);
  });
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
