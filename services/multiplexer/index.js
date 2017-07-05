const express = require('express');

const redis = require('thunk-redis');

const client = redis.createClient();

function createMultiplexer(mx, callback) {
  client.hmset('multiplexer', mx, 0)((err, res) => callback(null, res));
}

function checkIfMultiplexerExists(mx, callback) {
  client.hexists('multiplexer', mx)((err, res) => callback(null, res));
}

function deleteMultiplexer(mx, callback) {
  client.hdel('multiplexer', mx, 0)((err, res) => callback(null, res));
}

function getAllMultiplexer(callback) {
  client.hgetall('multiplexer')((err, res) => callback(null, res));
}

module.exports = {
  createMultiplexer,
  deleteMultiplexer,
  getAllMultiplexer,
  checkIfMultiplexerExists,
};

