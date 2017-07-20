module.exports = {
  kafka: {
    host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
    port: process.env.ZOOKEEPER_PORT || '2181',
    topics: { topic: process.env.CONSUMER_GROUP || 'mx1' },
    numberOfMessages: process.env.NUMBER_OF_MESSAGES || 1000000,
  },
  noOfPartitions: process.env.PARTITION_COUNT || 1
};
