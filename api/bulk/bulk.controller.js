const bulkDao = require('../../dao').bulk;
const circleDAO = require('../../dao').circle;

function getAllCircles(req, res) {
  circleDAO.getAllCircles((err, result) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    if (result.rows === 0) { res.status(404).json({ message: 'No circles found' }); return; }
    res.status(201).json(result.rows);
  });
}


module.exports = {
  getAllCircles,
};
