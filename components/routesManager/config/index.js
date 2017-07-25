module.exports = {
  kafka: {
    host: process.env.ZOOKEEPER_HOST || '172.23.238.134',
    port: process.env.ZOOKEEPER_PORT || '2181',
    topics: [process.env.ROUTES_TOPIC || 'routes'],
    options: {
      host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
      groupId: process.env.CONSUMER_GROUP || 'routes',
      autoCommit: false,
      fromOffset: true,
    },

  },
  redis: {
    host: process.env.REDIS_HOST || '172.23.238.134',
    port: process.env.REDIS_PORT || '6379',
  },
  namespace: process.env.NAMESPACE_L1R || 'L1R',
  namespacemul: process.env.NAMESPACE_MULTIPLEXER || 'multiplexer',
  namespaceroutemanager: process.env.NAMESPACE_ROUTESMANAGER || 'routesmanager',
};