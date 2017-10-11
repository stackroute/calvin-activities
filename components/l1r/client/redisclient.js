const config =require('../config').redis;

const redis = require('thunk-redis');

console.log(`redisHost:${config.host},redisPort:${config.port}`);

const client = redis.createClient(`${config.host}:${config.port}`);

module.exports = {
  client,
};
