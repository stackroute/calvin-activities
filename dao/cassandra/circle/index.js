const start=require('../../../db');

const client=start.client;
const uuid = start.uuid;

function createCircle(callback) {
  const newCircle = {
    id: uuid().toString(),
  };
  console.log('inside cassandra');
  const query = ('INSERT INTO circle (id) values( ? )');
  client.execute(query, [newCircle.id], (err, result) => {
    if (err) { return callback(err, null); }
    return callback(err, newCircle);
  });
}

function checkIfCircleExists(circleId, callback) {
  const query = (`SELECT * from circle where id = ${circleId}`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err, null); }
    return callback(null, result.rowLength > 0);
  });
}

function deleteCircle(circleId, callback) {
  const query =(`DELETE from circle where id =${circleId}`);
  client.execute(query, (error, result) => {
    if (error) { return callback(error, null); }
    return callback(null, { id: circleId });
  });
}


module.exports = {
  createCircle, checkIfCircleExists, deleteCircle,
};
