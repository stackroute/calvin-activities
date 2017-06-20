const circleDAO = require('../../dao').circle;


function createCircle(req, res) {
  circleDAO.createCircle((err, id) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(201).json(id);
  });
}

function deleteCircle(req, res) {
  circleDAO.checkIfCircleExists(req.params.circleId, (err1, doesCircleExists) => {
    if (!doesCircleExists) {
      res.status(404).json({ message: 'Circle does not exists' });
      return;
    }
    circleDAO.deleteCircle(req.params.circleId, (err, id) => {
      if (err) { res.status(404).json({ message: `${err}` }); return; }
      res.status(200).json(id);
    });
  });
}

module.exports = {
  createCircle, deleteCircle,
};
