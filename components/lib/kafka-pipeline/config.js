module.exports = {
  kafka: {
    host: process.env.ZOOKEEPER_HOST || 'localhost',
    port: process.env.ZOOKEEPER_PORT || 2181
  }
}
