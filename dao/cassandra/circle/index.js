const start = require('../../../db');
const config = require('../../../config');

const client = start.client;
const uuid = start.uuid;

function createCircle(callback) {
  const newCircle = {
    circleId: uuid().toString(),
    mailboxId: uuid().toString(),
    createdOn: new Date(),
  };
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

function getAllCircles(limit, callback) {
  if (limit == 0) {
    return callback('limit is set to 0', null);
  } else if (limit == -1) {
    const query = ('SELECT * from circle');
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      return callback(null, result);
    });
  } else if (limit === undefined) {
    limit = config.defaultLimit;
    const query = (`SELECT * from circle limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      return callback(null, result);
    });
  } else {
    const query = (`SELECT * from circle limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      return callback(null, result);
    });
  }
}

module.exports = {
  createCircle, checkIfCircleExists, deleteCircle, getAllCircles,
};
