module.exports = {
  kafka: {
    host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
    port: process.env.ZOOKEEPER_PORT || '2181',
    topics: { topic: process.env.CONSUMER_GROUP || 'm1' },
    options: {
      autoCommit: false,
      fromOffset: true,
    },
    activitiesTopic: 'activities',
  },
  consumerGroupName: process.env.CONSUMER_GROUP || 'm1'
};
