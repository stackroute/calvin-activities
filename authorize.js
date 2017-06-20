const jwt = require('jsonwebtoken');

const secretKey = require('./secret.js');

const circlePermissions=['circle-write','circle-delete', 'circle-all'];

const generateJWTToken = () => {
  const token = jwt.sign({ username: 'Mayank Sethi', permission: 'circle-write' }, secretKey);
  return token;
};

const verifyToken = (req, res, next) => {
  const auth = req.get('Authorization');
  if (!auth) { return res.status(404).send('Authorization Required'); } else if (!auth.includes('Bearer')) { return res.status(401).send('Invalid Authorization'); }
  const token = auth.split(' ').pop().toString();
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) { return res.status(404).send('Invalid Authorization'); }
    next();
    return 'Authorized';
  });
  return 'Authorizing';
};

const permit = (req, res, next) => {
  const auth = req.get('Authorization');
  if (!auth) { return res.status(404).send('Authorization Required'); } else if (!auth.includes('Bearer')) { return res.status(401).send('Invalid Authorization'); }
  const token = auth.split(' ').pop().toString();
  const decoded = jwt.decode(token, { complete: true });
  const permission = decoded.payload.permission;
  if (circlePermissions.indexOf(permission)) { return res.status(404).send('Not Permitted'); }
  next();
  return 'Permitting';
};


module.exports = {
  generateJWTToken,
  verifyToken,
  permit,
};
