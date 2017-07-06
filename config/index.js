const secret = require('../secret.js');

module.exports = {
  connectionString: {
    keyspace: 'testdb',
    contact: '127.0.0.1',
    port: '9042',
  },
  secretKey: secret,
  dao: process.env.DAO || 'cassandra',
  kafka: {
    host: "127.0.0.1",
    port: "2181",
    topics : { topic: "testingKafka", partition: 0 , offset : 0  },
    options : {
            "autoCommit": false,
            "fromOffset" : true
        }
  },
  // redis:{
  //      mxdCachePrefix: "notifications",
  //  },
  
//   l1rCachePrefix: "L1R",

 };
