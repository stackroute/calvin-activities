module.exports = {
  connectionString: {
    keyspace: process.env.DSE_KEYSPACE || 'testdb',
    contact: process.env.DSE_HOST || '172.23.238.134',
    port: process.env.DSE_PORT || '9042',
  },
  dao: process.env.DAO || 'cassandra',
  kafka: {
    host: process.env.ZOOKEEPER_HOST || '172.23.238.134',
    port: process.env.ZOOKEEPER_PORT || '2181',
    topics: [ process.env.EVENTS_TOPIC || 'events' ],
    routesTopic: process.env.ROUTES_TOPIC || 'routes',
    activitiesTopic: process.env.ACTIVITIES_TOPIC || 'activities',
    options: {
      groupId: process.env.CONSUMER_GROUP || 'events',
      autoCommit: false,
      fromOffset: true,
    },
  },
  redis: {
    host: process.env.REDIS_HOST || '172.23.238.134',
    port: process.env.REDIS_PORT || '6379',
  },
};
