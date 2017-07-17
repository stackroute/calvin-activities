module.exports = {
  connectionString: {
    keyspace: 'testdb',
    contact: '172.23.238.134',
    port: '9042',
  },
  dao: process.env.DAO || 'cassandra',
  kafka: {
    host: '172.23.238.134',
    port: '2181',
    topics: { topic: 'routes' },
    options: {
      autoCommit: false,
      fromOffset: true,
    },

  },
  redis: {
    host: '172.23.238.134',
    port: '6379',
  },
  namespace: 'L1R',
  namespacemul: 'multiplexer',
  namespaceroutemanager: 'routesmanager',
};
