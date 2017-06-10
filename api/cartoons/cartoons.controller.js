const cartoons = [];
let idCounter = -1;

function retrieveAllCartoons(req, res) {
  res.status(200).json(cartoons);
}

function retrieveCartoon(req, res) {
  const id = parseInt(req.params.id, 10);
  const filteredCartoons = cartoons.filter(cartoon => cartoon.id === id);

  if (filteredCartoons.length === 0) { res.status(404).send(); return; }
  res.status(200).json(filteredCartoons[0]);
}

function createNewCartoon(req, res) {
  idCounter += 1;
  const newCartoon = {
    id: idCounter,
    name: req.body.name,
    author: req.body.author,
  };
  cartoons.push(newCartoon);
  res.status(201).json(newCartoon);
}

function updateCartoon(req, res) {
  const id = parseInt(req.params.id, 10);
  const updatedCartoon = req.body;

  // Find Cartoon
  const filteredCartoons = cartoons.filter(cartoon => cartoon.id === id);

  if (filteredCartoons.length === 0) { res.status(404).send(); return; }

  const index = cartoons.indexOf(filteredCartoons[0]);

  cartoons.splice(index, 1, updatedCartoon);
}

function deleteCartoon(req, res) {
  const id = parseInt(req.params.id, 10);

  // Find Cartoon
  const filteredCartoons = cartoons.filter(cartoon => cartoon.id === id);

  if (filteredCartoons.length === 0) { res.status(404).send(); return; }

  const index = cartoons.indexOf(filteredCartoons[0]);
  cartoons.splice(index, 1);
}

module.exports = {
  retrieveAllCartoons,
  retrieveCartoon,
  createNewCartoon,
  updateCartoon,
  deleteCartoon,
};
