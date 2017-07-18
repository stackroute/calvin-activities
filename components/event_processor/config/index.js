module.exports = {
  connectionString: {
    keyspace: 'testdb',
    contact: '127.0.0.1',
    port: '9042',
  },
  dao: process.env.DAO || 'cassandra',
  kafka: {
    ost: process.env.ZOOKEEPER_HOST || '127.0.0.1',
    port: process.env.ZOOKEEPER_PORT || '2181',
    topics: [ process.env.CONSUMER_GROUP || 'eventsTest'  ], 
    options: {
      groupId: process.env.CONSUMER_GROUP || 'eventsTest',
      autoCommit: false,
      fromOffset: true,
    },
    routesTopic: 'routeTest',
  },
  redis: {
    host: '127.0.0.1',
    port: '6379',
  },
};
