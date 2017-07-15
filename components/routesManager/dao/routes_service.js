const express = require('express');
const redis = require('thunk-redis');
const namespace = require('../config').namespaceroutemanager;

const client = require('../client/redisclient').client;

const multiplexerService = require('../services/multiplexer');
const l1rService = require('../services/l1r');
const multiplexerRouteService = require('../services/multiplexer-route');


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
  client.srem(`${namespace}`, circleId, userId)((err, res) => {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}

function addRoute(circleId, userId, callback) {
  createRoute(circleId, userId, (err, result) => {
    if (err) { return callback(err, null); }
    getMultiplexerStatus((err1, selectedMultiplexer) => {
      if (!selectedMultiplexer) { return callback(err, 'No multiplexer available'); }
      if (err1) { return callback(err1, null); }
      l1rService.addRoute({ circleId, multiplexerId: selectedMultiplexer }, (err2, result2) => {
        if (err2) { return callback(err2, null); }
        multiplexerService.addMultiplexer(selectedMultiplexer, (err3, result3) => {
          if (err3) { return callback(err3, null); }
          multiplexerRouteService.addRoute({ namespace: selectedMultiplexer, circleId, mailboxId: userId }, (err4, result4) => {
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


function removeRoute(circleId, userId, multiplexerId, callback) {
  const route = {
    circleId,
    multiplexerId,
  };
  l1rService.deleteRoute(route, (err5, res2) => {
    if (res2 === 0) { return callback(err5, 'No routes present'); }
    if (err5) { throw err5; }
    multiplexerService.deleteMultiplexer(multiplexerId, (err6, res3) => {
      if (err6) { throw err6; }
      const route1 = {
        namespace: multiplexerId,
        circleId,
        mailboxId: userId,
      };
      multiplexerRouteService.deleteRoute(route1, (err7, res4) => {
        if (err7) { throw err7; }
        return callback(null, 'Routes deleted');
      });
      return callback(null, { circleId, userId, multiplexerId });
    });
    return callback(null, res2);
  });
}

module.exports = {
  createRoute,
  getMultiplexerStatus,
  deleteRoute,
  addRoute,
  removeRoute,
};
