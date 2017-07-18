const config = require('../config').dse;

const model = require('cassandra-driver');

const client = new model.Client({
  contactPoints: [config.host],
  protocolOptions: { port: config.port },
  keyspace: config.keyspace,
});


module.exports ={
  client, uuid: model.types.Uuid.random,
};
