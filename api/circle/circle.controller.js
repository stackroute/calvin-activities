const circleDAO = require('../../dao').circle;

// const async= require('async');

function createCircle(req, res) {
  circleDAO.createCircle((err, newCircle) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(201).json(newCircle);
  });
}

function deleteCircle(req, res) {
  circleDAO.checkIfCircleExists(req.params.circleId, (error, doesCircleExists) => {
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesCircleExists) {
      res.status(404).json({ message: 'circle does not exist' });
      return;
    }
    circleDAO.deleteCircle(req.params.circleId, (err, deletedCircle) => {
      if (err) { res.status(500).json({ message: `${err}` }); return; }
      res.status(200).json(deletedCircle);
    });
  });
}

function getAllCircles(req, res) {
  circleDAO.getAllCircles(req.query.limit, (err, result) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(200).json({totalItems: result.a, items: result.b});
  });
}

module.exports = {
  createCircle, deleteCircle, getAllCircles,
};
