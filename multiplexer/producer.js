const kafka = require('kafka-node');

const redisClient = require('../client/redisclient');

const express = require('express');

const redis = require('thunk-redis');

const client = redis.createClient();

Producer = kafka.Producer;
KeyedMessage = kafka.KeyedMessage;
Client = new kafka.Client();
producer = new Producer(Client);

const msg = {
  payload:{
    name: 'ABC',
    activity:'third user added '
  },
  circleId: 'C1',
};

const activity = [{ topic: 'M2', messages: JSON.stringify(msg) }];


producer.on('ready', () => {
  producer.send(activity, (err, data) => {
  });
});

producer.on('error', (err) => {});
