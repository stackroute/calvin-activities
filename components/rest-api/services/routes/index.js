const express = require('express');
const redis = require('thunk-redis');
const namespace = require('../../config').namespaceroutemanager;

const client = require('../../client/redisclient').client;

const multiplexerService = require('../../services/multiplexer');
const l1rService = require('../../services/l1r');
const multiplexerRouteService = require('../../services/multiplexer-route');


function getMultiplexerStatus(callback) {
  multiplexerService.getAllMultiplexer((err, result) => {
    if (JSON.stringify(result) === '{}') {
      return callback(err, null);
    }
    const a = [];
    if (Object.prototype.hasOwnProperty) {
      Object.keys(result).forEach((x, index) => {
        if (x !== null) { a.push([x, result[x]]); }
      });
    }
    a.sort((a1, b1) => a1[1] - b1[1]);
    const z = a[0][0];
    return callback(null, z);
  });
}

function createRoute(circleId, userId, callback) {
  client.sadd(`${namespace}:${circleId}`, userId)((err, res) => {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function deleteRoute(circleId, userId, callback) {
  client.srem(`${namespace}:${circleId}`, userId)((err, res) => {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function addRoute(circleId, userId, callback) {
  // console.log(`inside addRoute---->${circleId}userId---->-${userId}`);
  createRoute(circleId, userId, (err, result) => {
    if (err) { return callback(err, null); }
    getMultiplexerStatus((err1, selectedMultiplexer) => {
      if (!selectedMultiplexer) { return callback(err, 'No multiplexer available'); }
      if (err1) { return callback(err1, null); }
      l1rService.addRoute({ circleId, multiplexerId: selectedMultiplexer }, (err2, result2) => {
        // console.log('result2--->'+result2);
        if (err2) { return callback(err2, null); }
        multiplexerService.addMultiplexer(selectedMultiplexer, (err3, result3) => {
          // console.log('result3--->'+result3);
          if (err3) { return callback(err3, null); }
          multiplexerRouteService.addRoute({ namespace: selectedMultiplexer, circleId, mailboxId: userId }, (err4, result4) => {
            // console.log('result4--->'+JSON.stringify({ namespace: selectedMultiplexer, circleId, mailboxId: userId }));
            if (err4) { return callback(err4, result4); }
            return callback(null, 'Routes added');
          });
          return callback(err3, null);
        });
        return callback(err2, null);
      });
      return callback(err1, selectedMultiplexer);
    });
    return callback(err, null);
  });
}



function removeRoute(circleId, userId, callback) {
  const circle = {
    circleId: circleId,
  };

  deleteRoute(circleId, userId, (err, result) => {
    if (err) { throw err; }
     l1rService.getRoutesForCircle(circle, (err, multiplexerList) => {
    for (let i = 0; i < multiplexerList.length; i += 1) {
       multiplexerRouteService.checkIfCircleIsPresentinCache({namespace:multiplexerList[i], circleId:circle.circleId}, (err, res) => {
        if (res === 1) { multiplexerRouteService.getMultiplexer(multiplexerList[i], circle.circleId, userId, (err, result) => {
          if (err) { throw err; }
        });
        }
       });
    }
  });
});
return callback ( null, "del");
}








module.exports = {
  createRoute,
  getMultiplexerStatus,
  deleteRoute,
  addRoute,
  removeRoute,
};
