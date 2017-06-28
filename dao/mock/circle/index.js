const circles=[];
// let idCounter = 0;
// const start=require('../../../db');
// const uuid = start.uuid;

const uuidv4 = require('uuid/v4');

function createCircle(callback) {
  const id1 = uuidv4();
  // console.log(id1);
  circles.push(id1);
  return callback(null, id1);
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
