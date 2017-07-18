module.exports = {
  kafka: {
    host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
    port: process.env.ZOOKEEPER_PORT || '2181',
    topics: [process.env.CONSUMER_GROUP || 'm1D'],
    options: {
      host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
      groupId: process.env.CONSUMER_GROUP || 'm1D',
      sessionTimeout: 15000,
      protocol: ['roundrobin'],
      fromOffset: 'earliest',
    },
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
  },
  dse: {
    host: process.env.DSE_HOST || '127.0.0.1',
    port: process.env.DSE_PORT || '9042',
    keyspace: process.env.DSE_KEYSPACE || 'testdb',
  },
};
