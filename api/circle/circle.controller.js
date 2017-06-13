const dao = require('../../dao/circle');

function createCircle(req, res) {
  res.status(201).json(dao.createCircle());
}

function deleteCircle(req, res) {
  const CircleExist = dao.checkIfCircleExists(req.params.circleId);
  if (CircleExist) {
    const result = dao.deleteCircle(req.params.circleId);
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: `Circle id ${req.params.circleId} does not exist` });
  }
}

module.exports = {
  createCircle, deleteCircle,
};
