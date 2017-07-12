const secret = require('../secret.js');

module.exports = {
  connectionString: {
    keyspace: 'testdb',
    contact: '172.23.238.134',
    port: '9042',
  },
  secretKey: secret,
  dao: process.env.DAO || 'cassandra',
  kafka: {
    host: '172.23.238.134',
    port: '2181',
    topics: { topic: 'm3', partition: 0, offset: 0 },
    options: {
      autoCommit: false,
      fromOffset: true,
    },
    activitiesTopic: 'activities',
  },
  redis: {
    host: '172.23.238.134',
    port: '6379',
  },
  namespace: 'L1R',
  namespacemul: 'multiplexer',
  namespaceroutemanager: 'routesmanager',
};
