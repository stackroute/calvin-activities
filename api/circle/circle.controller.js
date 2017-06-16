const circleDAO = require('../../dao/circle');

function createCircle(req, res) {
  res.status(201).json(circleDAO.createCircle());
}

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
