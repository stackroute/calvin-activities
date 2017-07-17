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
    activitiesTopic: 'activities',
    eventsTopic: 'events',
    monitoringTopic: 'monitor',
  },
  redis: {
    host: '127.0.0.1',
    port: '6379',
  },
  namespace: 'L1R',
  namespacemul: 'multiplexer',
  namespaceroutemanager: 'routesmanager',
  defaultLimit: 5,
};
