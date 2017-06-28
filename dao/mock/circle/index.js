const circles=[];
const start=require('../../../db');

const uuid = start.uuid;

function createCircle(callback) {
  const newCircle = {
    id: uuid().toString(),
    createdOn: Date.now(),
    lastActivity: Date.now(),
  };
  circles.push(newCircle);
  return callback(null, newCircle);

}

function checkIfCircleExists(circleId, callback) {
  const filterCircle = circles.filter(circle => circle.id === circleId);
  callback(null, filterCircle.length!==0);
}

function deleteCircle(circleId, callback) {
  const filter = circles.filter(circle => circle.id === circleId);
  circles.splice(circles.indexOf(filter[0]), 1);
  return callback(null, filter[0]);
}
module.exports = {
  createCircle, deleteCircle, checkIfCircleExists,
};
