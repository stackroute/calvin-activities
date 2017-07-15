module.exports = {
  connectionString: {
    keyspace: 'testdb',
    contact: '127.0.0.1',
    port: '9042',
  },
    dao: process.env.DAO || 'cassandra',
  kafka: {
    host: '127.0.0.1',
    port: '2181',
    topics: { topic: 'events'},
    options: {
      autoCommit: false,
      fromOffset: true,
    },
   routesTopic: 'route',
  },
  redis: {
    host: '127.0.0.1',
    port: '6379',
  },
};
