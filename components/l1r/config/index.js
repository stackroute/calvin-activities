module.exports = {
  kafka: {
    host: process.env.ZOOKEEPER_HOST || '172.23.238.134',
    port: process.env.ZOOKEEPER_PORT || '2181',
    topics: [process.env.CONSUMER_GROUP || 'activities1'],
    options: {
      host: process.env.ZOOKEEPER_HOST || '172.23.238.134',
      groupId: process.env.CONSUMER_GROUP || 'activities1',
      sessionTimeout: 15000,
      protocol: ['roundrobin'],
      fromOffset: 'earliest',
    },
  },
  redis: {
    host: process.env.REDIS_HOST || '172.23.238.134',
    port: process.env.REDIS_PORT || '6379',
    namespace: 'L1R',
  },
};
