const circles=[];
let idCounter = 0;

function createCircle(callback) {
  const newcircle = {
    id: JSON.stringify(idCounter += 1),
  };
  circles.push(newcircle);

  return callback(null, newcircle);
}
function checkIfCircleExists(circleId, callback) {
  const filterCircle = circles.filter(circle => circle.id === circleId);

  return callback(null, filterCircle.length!==0);
}
function deleteCircle(circleId, callback) {
  checkIfCircleExists(circleId, (err, circleExists) => {
    if (err) { return callback(err, null); }
    if (circleExists === false) {
      return callback(`Circle id ${circleId} does not exist`, null);
    } else {
      const filter = circles.filter(y => y.id === circleId);

      circles.splice(circles.indexOf(filter[0]), 1);
      return callback(null, filter[0]);
    }
  });
}


module.exports = {
  createCircle, deleteCircle, checkIfCircleExists,
};
