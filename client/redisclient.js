const config =require('../config').redis;

const redis = require('thunk-redis');

const client = redis.createClient(`${config.host}:${config.port}`);

module.exports = {
  client,
};
