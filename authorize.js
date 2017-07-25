const jwt = require('jsonwebtoken');

const config = require('./config');

const generateJWTToken = () => {
  const token = jwt.sign({ username: 'Mayank Sethi', scopes: ['circle:all', 'mailbox:all', 'follow:all'] },
    config.secretKey);
  return token;
};

const verifyToken = (req, res, next) => {
  const auth = req.get('Authorization');
  if (!auth) { return res.status(404).json({ message: 'Authorization Required' }); }
  if (!auth.includes('Bearer')) { return res.status(404).json({ message: 'Invalid Authorization' }); }
  const token = auth.split(' ').pop().toString();
  const decodeToken = jwt.decode(token, { complete: true });
  if (!decodeToken.payload.scopes) { return res.status(404).json({ message: 'Invalid Authorization' }); }
  const scopes = decodeToken.payload.scopes;
  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) { return res.status(404).json({ message: 'Invalid Authorization' }); }
    req.claims = scopes;
    next();
    return 'Authorized';
  });
  return 'Authorizing';
};

const permit = (...allowed) =>
  (req, res, next) => {
    let isAllowed;
    const scopes = req.claims;

    scopes.forEach((element) => {
      if ((allowed.indexOf(element) > -1)) { isAllowed = true; }
    });
    if (!isAllowed) { return res.status(404).json({ message: 'Invalid Permission' }); }
    return next();
  };

const verify = (auth, claims) => {
  let isAllowed = false;
  if (!auth) return isAllowed;
  const token = auth.split(' ').pop().toString();
  const decodeToken = jwt.decode(token, { complete: true });
  const scopes = decodeToken.payload.scopes;
  scopes.forEach((element) => {
    if ((claims.indexOf(element) > -1)) { isAllowed = true; }
  });
  return isAllowed;
};


module.exports = {
  generateJWTToken,
  verifyToken,
  permit,
  verify,
};
