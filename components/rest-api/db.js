const model = require('cassandra-driver');

const connection=require('./config');

const client = new model.Client({
  contactPoints: [connection.connectionString.contact],
  protocolOptions: { port: connection.connectionString.port },
  keyspace: connection.connectionString.keyspace,
});


module.exports ={
  client, uuid: model.types.Uuid.random,
};
