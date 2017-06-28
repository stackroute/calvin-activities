const circles=[];
let idCounter = 0;
const start=require('../../../db');

const uuid = start.uuid;

function createCircle(callback) {
  idCounter = (parseInt(Math.random()*192)).toString();
  const newCircle = {
    id:uuid(),
    createdOn:Date.now(),
    lastActivity:Date.now(),
  }
  circles.push(newCircle);
  return callback(null, newCircle);
}
function checkIfCircleExists(circleId, callback) {
  const filterCircle = circles.filter(circle => circle === circleId);
  callback(null, filterCircle.length!==0);
}
function deleteCircle(circleId, callback) {
  const filter = circles.filter(y => y === circleId);
  circles.splice(circles.indexOf(filter[0]), 1);
  return callback(null, filter[0]);
}
module.exports = {
  createCircle, deleteCircle, checkIfCircleExists,
};
