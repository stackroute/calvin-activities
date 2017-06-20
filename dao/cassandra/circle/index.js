const start=require('../../../db');

const client=start.client;
const uuid = start.uuid;

function createCircle(callback) {
  const id1 = uuid();
  const query = ('INSERT INTO circle (id) values( ? )');
  client.execute(query, [id1], (err, result) => {
    if (err) { return callback(err, null); }
    return callback(err, id1.toString());
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
  client.execute(query, (err, result) => {
    if (err) { return callback(err, null); }
    return callback(err, circleId);
  });
  return true;
}


module.exports = {
  createCircle, checkIfCircleExists, deleteCircle,
};
