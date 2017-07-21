const start = require('../../../db');

const config = require('../../../config');
const kafkaPipeline = require('kafka-pipeline');
const mailboxDAO = require('../mailbox');

const client = start.client;

console.log('routesTopic:', config.kafka.routesTopic);

const uuid = start.uuid;

function createCircle(callback) {
  mailboxDAO.createMailbox(function(err, newUser){
    if(err) { console.log('ERR:', err); return callback(err); }
    const newCircle = {
      circleId: uuid().toString(),
      mailboxId: newUser.mailboxId.toString(),
      createdOn: new Date()
    }
    const query = ('INSERT INTO circle (circleId, mailboxId, createdOn) values( ?, ?, ?)');
    console.log('query:', query);
    client.execute(query, [newCircle.circleId, newCircle.mailboxId, newCircle.createdOn], (err, result) => {
      if (err) { console.log('ERR:', err); return callback(err, null); }
      console.log('Executed Query Successfully');
      console.log('SENDING MESSAGE TO ROUTES');
      kafkaPipeline.producer.ready(function() {
        console.log('ROUTES_TOPIC:', config.kafka.routesTopic);
        kafkaPipeline.producer.send([{topic: config.kafka.routesTopic, messages: JSON.stringify({circleId: newCircle.circleId, mailboxId: newCircle.mailboxId, command: 'addRoute'})}]);
        return callback(null, newCircle);
        // return callback(null, newCircle);
      });
    });
  });
}

function checkIfCircleExists(circleId, callback) {
  const query = (`SELECT * from circle where circleId = ${circleId}`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err, null); }
    return callback(null, result.rowLength > 0);
  });
}

function deleteCircle(circleId, callback) {
  client.execute(`SELECT mailboxid from circle where circleId = ${circleId}`, (err, result) => {
    //TODO pass this circleMailboxId to remove route - result.rows[0].mailboxid.toString()
      if(err) { return callback(err); }
      if(result.rowLength == 0) {return callback('Circle not found'); }
      const query = (`DELETE from circle where circleId =${circleId}`);
      client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }

      return callback(null, { id: circleId });
    });
  });
}

function getAllCircles(limit, callback) {
  if (limit === 0) {
    return callback('limit is set to 0', null);
  } else if (limit === -1) {
    const query = ('SELECT * from circle');
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      const a = result.rows.length;
      const b = result.rows;
      return callback(null, { a, b });
    });
  } else if (limit === undefined) {
    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from circle limit ${defaultLimit}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      const a = result.rows.length;
      const b = result.rows;
      return callback(null, { a, b });
    });
  } else {
    const query = (`SELECT * from circle limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      const a = result.rows.length;
      const b = result.rows;
      return callback(null, { a, b });
    });
  }
}

module.exports = {
  createCircle, checkIfCircleExists, deleteCircle, getAllCircles,
};



