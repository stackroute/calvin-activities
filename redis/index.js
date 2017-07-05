const redis = require('thunk-redis');

const client = redis.createClient({
  database: 1,
});

module.exports = {
    client
}