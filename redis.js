const redis = require('thunk-redis');
const redisConfig = require('./config').redis;

const redisClient = redis.createClient(`${redisConfig.host}:${redisConfig.port}`);

module.exports = {
  redisClient,
};
