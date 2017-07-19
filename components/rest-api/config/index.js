const secret = require('../secret.js');

module.exports = {
  connectionString: {
    keyspace: process.env.DSE_KEYSPACE || 'testdb',
    contact: process.env.DSE_HOST || '172.23.238.134',
    port: process.env.DSE_PORT || '9042',
  },
  secretKey: secret,
  dao: process.env.DAO || 'cassandra',
  kafka: {
    host: process.env.ZOOKEEPER_HOST || '172.23.238.134',
    port: process.env.ZOOKEEPER_PORT || '2181',
    activitiesTopic: process.env.ACTIVITIES_TOPIC || 'activities1',
    eventsTopic: process.env.EVENTS_TOPIC || 'events1',
    routesTopic: process.env.ROUTES_TOPIC || 'routes1',
  },
  redis: {
    host: process.env.REDIS_HOST || '172.23.238.134',
    port: process.env.REDIS_PORT || '6379',
  },
  namespace: process.env.NAMESPACE_L1R || 'L1R',
  namespacemul: process.env.NAMESPACE_MULTIPLEXER || 'multiplexer1',
  namespaceroutemanager: process.env.NAMESPACE_ROUTESMANAGER || 'routesmanager',
  defaultLimit: process.env.DEFAULT_CIRCLE || 5,
};
