const circle = [];
let id = 0;

function retrieveAllCircles(req, res) {
  res.status(200).json(circle);
}
function createNewCircle(req, res) {
  const newcircle = {
    id: id += 1,
  };
  circle.push(newcircle);
  res.status(201).json(newcircle);
}
function deleteCircle(req, res) {
  id = +req.params.id;
  const filteredCircle = circle.filter(circles => circles.id === id);
  if (filteredCircle.length === 0) { res.status(404).send(); return; }

  const index = circle.indexOf(filteredCircle[0]);
  circle.splice(index, 1);
  res.status(200).json(filteredCircle[0]);
}
module.exports = {
  retrieveAllCircles, createNewCircle, deleteCircle,
};
