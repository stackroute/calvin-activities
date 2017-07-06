const express = require('express');

const redis = require('thunk-redis');

const client = redis.createClient();

const multiplexerService = require('../multiplexer/');

function getMultiplexerStatus(callback){
  multiplexerService.getAllMultiplexer((err, result) => {
    var a = [];
    for (var x in result) {
      a.push([x, result[x]]);
    }
    a.sort(function (a, b) {
      return a[1] - b[1];
    });
    let z = a[0][0];
    console.log(z);
    callback(null, z);
  })
}

function createRoute(circleId, userId, callback) {
  client.sadd('routesmanager', circleId, userId)(function (err, res) {
    if (err) { callback(err, null); return; }
    callback(null, res);
  });
}


module.exports = {
  createRoute,
  getMultiplexerStatus,
};
