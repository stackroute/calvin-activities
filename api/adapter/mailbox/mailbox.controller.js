
const adapterDAO = require('../../../dao/cassandra/adapter');


function createUser(req, res) {
  const newUser = req.params.user;
  adapterDAO.createUser(newUser, (err, user) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(201).json({ user });
  });
}

function deleteUser(req, res) {
  adapterDAO.checkIfUserExists(req.params.user, (error, doesUserExists) => {
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesUserExists) {
      res.status(404).json({ message: 'User does not exist' });
      return;
    }
    adapterDAO.deleteUser(req.params.user, (err, deletedUser) => {
      if (err) { res.status(500).json({ message: `${err}` }); }
      res.status(200).json(deletedUser);
    });
  });
}


module.exports = {
  createUser, deleteUser,
};
