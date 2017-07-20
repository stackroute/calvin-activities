module.exports = {
  kafka: {
    host: process.env.ZOOKEEPER_HOST || '172.23.238.134',
    port: process.env.ZOOKEEPER_PORT || '2181',
    topics: [process.env.CONSUMER_GROUP || 'M12D'],
    options: {
      host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
      groupId: process.env.CONSUMER_GROUP || 'm1D',
      id: process.env.CONSUMER_GROUP|| 'm1x',
      sessionTimeout: 15000,
      protocol: ['roundrobin'],
      fromOffset: 'latest',
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
