const circleDAO = require('../../dao').circle;

function createCircle(req, res) {
  circleDAO.createCircle((err, id) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(201).json({ id });
  });
}

function deleteCircle(req, res) {
  circleDAO.checkIfCircleExists(req.params.circleId, (error, doesCircleExists) => {
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesCircleExists) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    circleDAO.deleteCircle(req.params.circleId, (err, id) => {
      if (err) { res.status(500).json({ message: `${err}` }); return; }
      res.status(200).json({ id });
    });
  });
}

module.exports = {
  createCircle, deleteCircle,
};
