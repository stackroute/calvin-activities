const start=require('../../../db');

const client=start.client;
const uuid = start.uuid;

function createCircle(callback) {
  const id1 = uuid();
  const query = ('INSERT INTO circle (id) values( ? )');
  client.execute(query, [id1], (err, result) => {
    // if (err) { return callback(err, null); }
    // return
    callback(err, id1.toString());
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
  checkIfCircleExists(circleId, (err, circleExists) => {
    if (err) { return callback(err, null); }
    if (circleExists===false) {
      return callback(`circle id ${circleId} does not exis`, null);
    } else {
      const query =(`DELETE from circle where id =${circleId}`);
      client.execute(query, (error, result) => callback(error, circleId));
      return { circleId };
    }
  });
}


module.exports = {
  createCircle, checkIfCircleExists, deleteCircle,
};
