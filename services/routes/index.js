const express = require('express');
const redis = require('thunk-redis');
const namespace = require('../../config').namespaceroutemanager;

const client = redis.createClient();

const multiplexerService = require('../../services/multiplexer');
const l1rService = require('../../services/l1r');
const multiplexerRouteService = require('../../services/multiplexer-route');


function getMultiplexerStatus(callback) {
  multiplexerService.getAllMultiplexer((err, result) => {
    if (result === null || result === undefined) {
      return callback('No multiplexers configured', null);
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
  client.srem(`${namespace}`, circleId, userId)((err, res) => {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function addRoute(circleId, userId, callback) {
  console.log(`inside addRoute---->${circleId}userId---->-${userId}`);
  createRoute(circleId, userId, (err, result) => {
    if (err) { return callback(err, null); }
    getMultiplexerStatus((err1, selectedMultiplexer) => {
      // console.log('selectedMultiplexer--->'+selectedMultiplexer);
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
            return callback(null, { circleId, mailboxId: userId });
          });
          return callback(err3, result3);
        });
        return callback(err2, result2);
      });
      return callback(err1, selectedMultiplexer);
    });
    return callback(err, result);
  });
}


module.exports = {
  createRoute,
  getMultiplexerStatus,
  deleteRoute,
  addRoute,
};
