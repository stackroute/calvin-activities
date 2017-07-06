const express = require('express');

const redis = require('thunk-redis');

const client = redis.createClient();

const namespace = require('../../config').namespacemul;

function createMultiplexer(mx, callback) {
  client.hmset(`${namespace}`, mx, 0)((err, res) => callback(null, res));
}

function checkIfMultiplexerExists(mx, callback) {
  client.hexists(`${namespace}`, mx)((err, res) => callback(null, res));
}

function deleteMultiplexer(mx, callback) {
  client.hdel(`${namespace}`, mx, 0)((err, res) => callback(null, res));
}

function getAllMultiplexer(callback) {
  client.hgetall(`${namespace}`)((err, res) => callback(null, res));
}

function addMultiplexer(mx, callback){
  console.log("mx" + mx);
  client.hincrby(`${namespace}`,mx,1)((err, res) => callback(null, res));
}
module.exports = {
  createMultiplexer,
  deleteMultiplexer,
  getAllMultiplexer,
  checkIfMultiplexerExists,
  addMultiplexer,
};

