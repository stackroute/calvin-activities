const secret = require('../secret.js');

module.exports = {
  connectionString: {
    keyspace: 'testdb',
    contact: '127.0.0.1',
    port: '9042',
  },
  secretKey: secret,
  dao: process.env.DAO || 'mock',
  redis: {
    host: 'localhost',
    port: 6379,
    l1rNamespace: 'L1R',
  },
  kafka: {
    host: 'localhost',
    port: '2181',
    activitiesTopic: 'activities',
  },
};
