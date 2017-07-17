const jwt = require('jsonwebtoken');

const config = require('./config');

const permissions = process.argv[2].split(',');

const winston = require('./winston');

const generateJWTToken = () => {
  const token = jwt.sign({ scopes: permissions },
    config.secretKey);
  winston.log('info', `token generated with permissions : ${permissions} \n\n${token}`);
  return token;
};

generateJWTToken(permissions);

module.exports = generateJWTToken;
