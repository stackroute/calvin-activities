module.exports = {
  kafka: {
    host: process.env.ZOOKEEPER_HOST || '172.17.0.1',
    port: process.env.ZOOKEEPER_PORT || 2181,
  },
  redis: {
    host: process.env.REDIS_HOST || '172.17.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
  noOfPartitions: process.env.PARTITION_COUNT || 1,
};
