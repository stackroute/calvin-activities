module.exports = {
  connectionString: {
    keyspace: 'testdb',
    contact: '127.0.0.1',
    port: '9042',
  },
  dao: process.env.DAO || 'cassandra',
    kafka: {
    host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
    port: process.env.ZOOKEEPER_PORT || '2181',
    topics: [process.env.CONSUMER_GROUP || 'routeTest'],
    options: {
      host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
      groupId: process.env.CONSUMER_GROUP || 'm1',
      sessionTimeout: 15000,
      protocol: ['roundrobin'],
      fromOffset: 'earliest',
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
