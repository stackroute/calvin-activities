const express = require('express');
//require('c')

const redis = require('thunk-redis');

const client = redis.createClient();

function add(mx, payload, callback) {
  client.hmset('Notification', mx, JSON.stringify(payload))((err, res) => callback(null, res));
}


module.exports = {

  client,add
};
