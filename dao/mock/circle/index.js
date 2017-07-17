  const start = require('../../../db');

const mailboxDao = require('../../index').mailbox;

const config = require('../../../config');

const circles = [];
const result = [];
const uuid = start.uuid;

function createCircle(callback) {
<<<<<<< HEAD
<<<<<<< HEAD
=======
  console.log('mock');
>>>>>>> 1859679a77dd2ea08a15a556a9535c010dd4a246
=======
>>>>>>> 1ed3f6b3bfd8c63f05d21972a3db27b45bc75081
  const newCircle = {
    circleId: uuid().toString(),
    mailboxId: uuid().toString(),
    createdOn: new Date(),
  };
  circles.push(newCircle);
  return callback(null, newCircle);
}

function checkIfCircleExists(circleId, callback) {
  const filterCircle = circles.filter(x => x.circleId === circleId);
  return callback(null, filterCircle.length !== 0);
}

function deleteCircle(circleId, callback) {
  const filter = circles.filter(y => y.circleId === circleId);
  circles.splice(circles.indexOf(filter[0]), 1);
  return callback(null, { id: filter[0].circleId });
}


function getAllCircles(limit, callback) {
  if (limit === 0) {
    return callback('limit is set to 0', null);
  } else if (limit === -1) {
    const a = circles.length;
    const b = circles;
    return callback(null, { a, b });
  } else if (limit === undefined) {
    const defaultLimit = config.defaultLimit;
    for (let i = 0; i < defaultLimit; i += 1) {
      result.push(circles[i]);
    }
    const a = result.length;
    const b = result;
    return callback(null, { a, b });
  } else {
    for (let i = 0; i < limit; i += 1) {
      result.push(circles[i]);
    }
    const a = result.length;
    const b = result;
    return callback(null, { a, b });
  }
}


module.exports = {
  createCircle,
  deleteCircle,
  checkIfCircleExists,
  getAllCircles,
};
