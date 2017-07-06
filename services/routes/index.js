const express = require('express');

const redis = require('thunk-redis');

const client = redis.createClient();

const multiplexerService = require('../multiplexer/');

const namespace = require('../../config').namespaceroutemanager;

function getMultiplexerStatus(callback) {
  multiplexerService.getAllMultiplexer((err, result) => {
    const a = [];
    if (Object.prototype.hasOwnProperty) {
      for (const x in result) {
        if (x !== null) { a.push([x, result[x]]); }
      }
    }
    a.sort((a1, b1) => a1[1] - b1[1]);
    const z = a[0][0];
    callback(null, z);
  });
}

function createRoute(circleId, userId, callback) {
  client.sadd(`${namespace}`, circleId, userId)((err, res) => {
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

module.exports = {
  createRoute,
  getMultiplexerStatus,
  deleteRoute,
};
