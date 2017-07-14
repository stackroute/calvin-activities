const configFile = require('./secret.json');

const secretKey = configFile.secretKey;

module.exports = secretKey;
