const start = require('../../../db');

const config = require('../../../config');
const kafkaPipeline = require('kafka-pipeline');
const mailboxDAO = require('../mailbox');

const client = start.client;

console.log('routesTopic:', config.kafka.routesTopic);

const uuid = start.uuid;

function createCircle(callback) {
  mailboxDAO.createMailbox((err, newUser) => {
    if (err) { callback(err); return; }
    const newCircle = {
      circleId: uuid().toString(),
      mailboxId: newUser.mailboxId.toString(),
      createdOn: new Date(),
    };
    const query = ('INSERT INTO circle (circleId, mailboxId, createdOn) values( ?, ?, ?)');
    client.execute(query, [newCircle.circleId, newCircle.mailboxId, newCircle.createdOn], (err2) => {
      if (err2) { callback(err2, null); return; }
      kafkaPipeline.producer.ready(() => {
        kafkaPipeline.producer.send([{
          topic: config.kafka.routesTopic,
          messages: JSON.stringify({
            circleId: newCircle.circleId,
            mailboxId: newCircle.mailboxId,
            command: 'addRoute',
          }) }]);
        callback(null, newCircle);
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
  client.execute(`SELECT mailboxid from circle where circleId = ${circleId}`, (err, res) => {
    // TODO pass this circleMailboxId to remove route - result.rows[0].mailboxid.toString()
    if (err) { callback(err); return; }
    if (res.rowLength === 0) { callback('Circle not found'); return; }
    const query = (`DELETE from circle where circleId =${circleId}`);
    client.execute(query, (error) => {
      if (error) { callback(error, null); return; }

      callback(null, { id: circleId });
    });
  });
}

function getAllCircles(limit, callback) {
  if (limit === 0) {
    callback('limit is set to 0', null);
  } else if (limit === -1) {
    const query = ('SELECT * from circle');
    client.execute(query, (error, result) => {
      if (error) { callback(error, null); return; }
      const a = result.rows.length;
      const b = result.rows;
      callback(null, { a, b });
    });
  } else if (limit === undefined) {
    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from circle limit ${defaultLimit}`);
    client.execute(query, (error, result) => {
      if (error) { callback(error, null); return; }
      const a = result.rows.length;
      const b = result.rows;
      callback(null, { a, b });
    });
  } else {
    const query = (`SELECT * from circle limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) { callback(error, null); return; }
      const a = result.rows.length;
      const b = result.rows;
      callback(null, { a, b });
    });
  }
}

module.exports = {
  createCircle, checkIfCircleExists, deleteCircle, getAllCircles,
};

