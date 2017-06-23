const jwt = require('jsonwebtoken');

const config = require('./config');

const permissions = process.argv[2].split(",");

const generateJWTToken = () => {
  const token = jwt.sign({ scopes : permissions },
    config.secretKey);
    console.log(token);
  return token;
};

const myToken = generateJWTToken(permissions);

module.exports = generateJWTToken;
