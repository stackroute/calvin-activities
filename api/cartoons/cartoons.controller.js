const cartoons = [];
let idCounter = -1;

function retrieveAllCartoons(req, res) {
  res.status(200).json(cartoons);
}

function retrieveCartoon(req, res) {
  const id = req.params.id;
  const filteredCartoons = cartoons.filter((cartoon) => {
    return cartoon.id == id;
  });

  if(filteredCartoons.length === 0) { res.status(404).send(); return; }
  res.status(200).json(filteredCartoons[0]);
}

function createNewCartoon(req, res) {
  const newCartoon = {
    id: ++idCounter,
    name: req.body.name,
    author: req.body.author
  }
  cartoons.push(newCartoon);
  res.status(201).json(newCartoon);
}

function updateCartoon(req, res) {
  const updatedCartoon = req.body;

  // Find Cartoon
  const filteredCartoons = cartoons.filter((cartoon) => {
    return cartoon.id === id;
  });

  if(filteredCartoons.length === 0) { res.status(404).send(); return; }

  const index = cartoons.indexOf(filteredCartoons[0]);

  cartoons.splice(index, 1, updatedCartoon);
}

function deleteCartoon(req, res) {
  // Find Cartoon
  const filteredCartoons = cartoons.filter((cartoon) => {
    return cartoon.id === id;
  });

  if(filteredCartoons.length === 0) { res.status(404).send(); return; }

  const index = cartoons.indexOf(filteredCartoons[0]);
  cartoons.splice(index, 1);
}

module.exports = {
  retrieveAllCartoons: retrieveAllCartoons,
  retrieveCartoon: retrieveCartoon,
  createNewCartoon: createNewCartoon,
  updateCartoon: updateCartoon,
  deleteCartoon: deleteCartoon
}