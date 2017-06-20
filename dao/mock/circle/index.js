const circles=[];
let idCounter = 0;

function createCircle(callback) {
  idCounter += 1;
  circles.push(idCounter.toString());
  return callback(null, idCounter.toString());
}
function checkIfCircleExists(circleId, callback) {
  const filterCircle = circles.filter(circle => circle === circleId);
  return callback(null, filterCircle.length!==0);
}
function deleteCircle(circleId, callback) {
  const filter = circles.filter(y => y === circleId);
  circles.splice(circles.indexOf(filter[0]), 1);
  return callback(null, filter[0]);
}
module.exports = {
  createCircle, deleteCircle, checkIfCircleExists,
};
