const express = require('express');
// require('c')

const redis = require('thunk-redis');

const client = require('../../client/redisclient').client;

function add(mx, payload, callback) {
  client.hmset('Notification', mx, JSON.stringify(payload))((err, res) => callback(null, res));
}


module.exports = {

  add,
};
