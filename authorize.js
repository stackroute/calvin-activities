const jwt = require('jsonwebtoken');

const secretKey = require('./secret.js'); // FIXME: Move secret.js into config

const generateJWTToken = () => {
  const token = jwt.sign({ username: 'Mayank Sethi', scopes: ['circle:all', 'mailbox:all', 'follow:all'] }, secretKey);
  return token;
};

const verifyToken = (req, res, next) => {
  const auth = req.get('Authorization');
  if (!auth) { return res.status(404).send('Authorization Required'); } else if (!auth.includes('Bearer')) { return res.status(401).send('Invalid Authorization'); }
  const token = auth.split(' ').pop().toString();
  const decodeToken = jwt.decode(token, { complete: true });
  const scopes = decodeToken.payload.scopes;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) { return res.status(404).send('Invalid Authorization'); }
    req.claims = scopes;
    next();
    return 'Authorized';
  });
  return next();
};

const permit = (...allowed) =>
  (req, res, next) => {
    let isAllowed;
    const scopes = req.claims;

    scopes.forEach((element) => {
      if ((allowed.indexOf(element) > -1)) { isAllowed = true; }
    });
    if (!isAllowed) { return res.status(404).send('Not Permitted'); }
    return next();
  };


module.exports = {
  generateJWTToken,
  verifyToken,
  permit,
};
