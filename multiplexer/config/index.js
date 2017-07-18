module.exports = {
  connectionString: {
    keyspace: 'testdb',
    contact: '127.0.0.1',
    port: '9042',
  },
  dao: process.env.DAO || 'cassandra',
  kafka: {
    host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
    port: process.env.ZOOKEEPER_HOST || '2181',
    topics: [process.env.CONSUMRER_GROUP || 'routeTest'], 
    options: {
      host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
      groupId: process.env.CONSUMRER_GROUP || 'm1',
      autoCommit: false,
      fromOffset: true,
    },

  },
  redis: {
    host: '127.0.0.1',
    port: '6379',
  },
  namespace: 'L1R',
  namespacemul: 'multiplexer',
  namespaceroutemanager: 'routesmanager',
};
