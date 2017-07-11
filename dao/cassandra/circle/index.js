const start = require('../../../db');

const client = start.client;
const uuid = start.uuid;

function createCircle(callback) {
  const newCircle = {
    circleId: uuid().toString(),
    mailboxId: uuid().toString(),
    createdOn: Date.now(),
  };
  console.log(`Created${newCircle.createdOn}`);
  const query = ('INSERT INTO circle (circleId, mailboxId, createdOn) values( ?, ?, ?)');
  client.execute(query, [newCircle.circleId, newCircle.mailboxId, newCircle.createdOn], (err, result) => {
    if (err) { return callback(err, null); }
    return callback(err, newCircle);
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
  const query = (`DELETE from circle where circleId =${circleId}`);
  client.execute(query, (error, result) => {
    if (error) { return callback(error, null); }
    return callback(null, { id: circleId });
  });
}

function getAllCircles(callback) {
  const query = ('SELECT * from circle');
  client.execute(query, (error, result) => {
    if (error) { return callback(error, null); }
    console.log('Inside cassandra');
    // if (result.rows === 0) { return callback(err, "No circles present");}
    return callback(null, result);
  });
}

module.exports = {
  createCircle, checkIfCircleExists, deleteCircle, getAllCircles,
};
