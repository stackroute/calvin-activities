const consumerGroupName = process.env.CONSUMER_GROUP || 'm1'

module.exports = {
  kafka: {
    host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
    port: process.env.ZOOKEEPER_PORT || '2181',
    topics: { topic: consumerGroupName, partition: 0, offset: 0 },
    options: {
      autoCommit: false,
      fromOffset: true,
    },
    activitiesTopic: 'activities',
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
  },
};
