const secret = require('../secret.js');

module.exports = {
  connectionString: {
    keyspace: 'testdb',
    contact: '127.0.0.1',
    port: '9042',
  },
  secretKey: secret,
  dao: process.env.DAO || 'cassandra',
  kafka: {
    host: '127.0.0.1',
    port: '2181',
    topics: [process.env.CONSUMER_GROUP || 'events'],
    options: {
      host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
      groupId: process.env.CONSUMER_GROUP || 'l1route',
      autoCommit: false,
      fromOffset: true,
    },
    activitiesTopic: 'activities',
    multiplexerTopic: 'm1',
    multiplexerConsumerGroup: 'm1CG',
  },
  redis: {
    host: '172.23.238.134',
    port: '6379',
  },
  namespace: 'L1R',
  namespacemul: 'multiplexer',
  namespaceroutemanager: 'routesmanager',
  defaultLimit: 10,
};
