module.exports = {
  kafka: {
    host: process.env.ZOOKEEPER_HOST || '127.0.0.1',
    port: process.env.ZOOKEEPER_PORT || 2181
  }
}
