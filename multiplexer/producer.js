const kafka = require('kafka-node');

// const redisClient = require('../client/redisclient');


// const redis = require('thunk-redis');

// const client = redis.createClient();

const Producer = kafka.Producer;
// const KeyedMessage = kafka.KeyedMessage;
const Client = new kafka.Client();
const producer = new Producer(Client);

const msg = {
  payload: {
    name: 'ABC',
    activity: 'fifth user added ',
  },
  circleId: 'C1',
};

const activity = [{ topic: 'M2', messages: JSON.stringify(msg) }];


producer.on('ready', () => {
  producer.send(activity, (err, data) => {
  });
});

producer.on('error', (err) => {});
