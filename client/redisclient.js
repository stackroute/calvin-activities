// require('c')

const redis = require('thunk-redis');

const client = redis.createClient();

function add(mx, payload, callback) {
  client.hmset('M1', mx, JSON.stringify(payload))((err, res) => callback(null, res));
}


module.exports = {

  client, add,
};
