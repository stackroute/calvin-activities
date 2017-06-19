const circles=[];
let idCounter = 0;

function createCircle() {
  const newcircle = {
    id: JSON.stringify(idCounter += 1),
  };
  circles.push(newcircle);
  return newcircle;
}
function deleteCircle(circleId) {
  const filter = circles.filter(y => y.id === circleId);

  circles.splice(circles.indexOf(filter[0]), 1);
  return filter[0];
}


function checkIfCircleExists(circleId) {
  const filterCircle = circles.filter(circle => circle.id === circleId);
  return filterCircle.length!==0;
}
module.exports = {
  createCircle, deleteCircle, checkIfCircleExists,
};
