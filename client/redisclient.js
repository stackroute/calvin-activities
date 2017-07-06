const express = require('express');
//require('c')
//const config =require('../config').redis;
const redis = require('thunk-redis');

const client = redis.createClient();
//const key = config.mxdCachePrefix;

function add(mx, payload, callback) {
  client.hmset('Notification', mx, JSON.stringify(payload))((err, res) => callback(null, res));
}


module.exports = {

  client,add
};
