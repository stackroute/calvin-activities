module.exports = {
  kafka: {
    host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
    port: process.env.ZOOKEEPER_PORT || '2181',
    topics: [process.env.CONSUMER_GROUP || 'activities'],
    options: {
      host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
      groupId: process.env.CONSUMER_GROUP || 'm1',
      sessionTimeout: 15000,
      protocol: ['roundrobin'],
      fromOffset: 'earliest',
    },
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
  },
};
