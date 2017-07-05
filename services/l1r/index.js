/* eslint prefer-arrow-callback:0, func-names:0 */

const redis = require('thunk-redis');

const thunk = require('thunks')();

const client = redis.createClient();

function checkIfrouteExists(route, callback) {
  // const multiplexerId = parseInt(route.multiplexerId);
  client.smembers(`L1R:${route.circleId}`)(function(err, res){
    if (err) { callback(err, null); return; }
    const doesExists = res.filter(data => data == route.multiplexerId);
    callback(null, doesExists.length !== 0);
  });
}

function addRoute(route, callback) {
  client.sadd(`L1R:${route.circleId}`, route.multiplexerId)(function(err, res){
    if (err) { callback(err, null); return; }
    return callback(null, res);
  });
}

function getRoutesList(callback) {
  client.keys('L1R:*')((err, res) => {
    if (err) { callback(err, null); return; }
    return callback(null, res);
  });
}

function checkIfCircleIdPresentinCache(route, callback) {
  client.exists(`L1R:${route.circleId}`)(function(err, res){
    if (err) { callback(err, null); return; }
    return callback(null, res.length !== 0);
  });
}

function getRoutesForCircle(route, callback) {
  client.smembers(`L1R:${route.circleId}`)(function(err, res){
    if (err) { callback(err, null); return; }
    return callback(null, res);
  });
}

function deleteRoute(route, callback) {
  client.srem(`L1R:${route.circleId}`, route.multiplexerId)((err, res) => {
    if (err) { callback(err, null); return; }
    return callback(null, res);
  });
}

module.exports = {
  addRoute,
  getRoutesForCircle,
  getRoutesList,
  deleteRoute,
  checkIfCircleIdPresentinCache,
  checkIfrouteExists,
};
