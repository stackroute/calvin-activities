/* eslint prefer-arrow-callback:0, func-names:0 */

const client = require('../../client/redisclient').client;

const namespace = require('../../config').namespace;

function checkIfRouteExists(route, callback) {
  const multiplexerId = (route.multiplexerId).toString();
  client.smembers(`${namespace}:${route.circleId}`)(function (err, res) {
    if (err) { callback(err, null); return; }
    const doesExists = res.filter(data => data === multiplexerId);
    callback(null, doesExists.length !== 0);
  });
}

function addRoute(route, callback) {
  client.sadd(`${namespace}:${route.circleId}`, route.multiplexerId)(function (err, res) {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function getRoutesList(callback) {
  client.keys(`${namespace}*`)((err, res) => {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function checkIfCircleIsPresentinCache(route, callback) {
  client.exists(`${namespace}:${route.circleId}`)(function (err, res) {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function getRoutesForCircle(route, callback) {
  client.smembers(`${namespace}:${route.circleId}`)(function (err, res) {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function deleteRoute(route, callback) {
  client.srem(`${namespace}:${route.circleId}`, route.multiplexerId)((err, res) => {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function deleteNamespace(circleId, callback ){
  client.spop(`${namespace}:${circleId}`)((err, res) => {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}


module.exports = {
  addRoute,
  getRoutesForCircle,
  getRoutesList,
  deleteRoute,
  checkIfCircleIsPresentinCache,
  checkIfRouteExists,
};
