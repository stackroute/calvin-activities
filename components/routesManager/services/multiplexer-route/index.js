/* eslint prefer-arrow-callback:0, func-names:0 */

const client = require('../../client/redisclient').client;
const multiplexerService = require('../multiplexer');
const l1rService = require('../l1r');

function checkIfRouteExists(route, callback) {
  const mailboxId = (route.mailboxId).toString();
  client.smembers(`${route.namespace}:${route.circleId}`)(function (err, res) {
    if (err) { callback(err, null); return; }
    const doesExists = res.filter(data => data === mailboxId);
    callback(null, doesExists.length !== 0);
  });
}

function addRoute(route, callback) {
  client.sadd(`${route.namespace}:${route.circleId}`, `${route.mailboxId}`)(function (err, res) {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function getRoutesList(route, callback) {
  client.keys(`${route.namespace}*`)((err, res) => {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function checkIfCircleIsPresentinCache(route, callback) {
  client.exists(`${route.namespace}:${route.circleId}`)(function (err, res) {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function getRoutesForCircle(route, callback) {
  client.smembers(`${route.namespace}:${route.circleId}`)(function (err, res) {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function deleteRoute(route, callback) {
  client.srem(`${route.namespace}:${route.circleId}`, route.mailboxId)((err, res) => {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function getMultiplexer(namespace, circleId , userId, callback){
    client.srem(`${namespace}:${circleId}`, userId)((err, res) => {
    if (err) { callback(err, null); }  
/*    if (res === 1){
       getRoutesForCircle({ namespace: namespace, circleId: circleId }, (err, res) => {
      if (res.length === 0) {
        l1rService.deleteRoute({ circleId: circleId, multiplexerId: namespace }, (err, result1) => {
          if (err) { throw err; }
        })
      }
      multiplexerService.deleteMultiplexer(namespace, (err, result) => {
        if (err) { throw err; }
      });
    });
    }*/
  });
}

module.exports = {
  addRoute,
  getRoutesForCircle,
  getRoutesList,
  deleteRoute,
  checkIfCircleIsPresentinCache,
  checkIfRouteExists,
  getMultiplexer,
};
