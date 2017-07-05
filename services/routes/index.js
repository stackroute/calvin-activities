const express = require('express');

const redis = require('thunk-redis');

const client = redis.createClient();

function createRoute(circleId, userId, callback) {
    client.sadd('routesmanager', circleId, userId)((err, res) => callback(null, res));
}


module.exports = {
    createRoute,
}
