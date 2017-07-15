const start = require('../../../db');
const config = require('../../../config');
const circleDAO = require('../circle');
const mailboxDAO = require('../mailbox');


const client = start.client;
const uuid = start.uuid;

function createDomain(domain, callback) {
  circleDAO.createCircle((err, newCircle) => {
    if (err) { return err; }
    const query = ('INSERT INTO domain (domain, circleid, mailboxid) values( ?, ?, ?)');
    client.execute(query, [domain, newCircle.circleId, newCircle.mailboxId], (err, result) => {
      if (err) { return callback(err, null); }
      return callback(null, domain);
    });
  });
}

function checkIfDomainExists(domain, callback) {
  const query = (`SELECT * from domain where domain = '${domain}'`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err, null); }
    if (result.rowLength == 0) { return callback(null, 0); }
    const obj = {
      circleid: result.rows[0].circleid,
      mailboxid: result.rows[0].mailboxid,
    };
    return callback(null, obj);
  });
}

function deleteDomain(domain, callback) {
  checkIfDomainExists(domain, (err, domainDetail) => {
    circleDAO.deleteCircle(domainDetail.circleid, (err, result) => {
      if (err) { return callback(err); }
      const query = (`DELETE from domain where domain = '${domain}'`);
      client.execute(query, (error, result) => {
        if (error) { return callback(error); }
        return callback(null, { message: domainDetail });
      });
    });
  });
}


function createUser(user, callback) {
  mailboxDAO.createMailbox((err, newUser) => {
    if (err) { return callback(err); }
    const query = ('INSERT INTO user (user, mailboxid) values( ?, ?)');
    client.execute(query, [user, newUser.mailboxId], (err, result) => {
      if (err) { return callback(err); }
      return callback(null, user);
    });
  });
}

function checkIfUserExists(user, callback) {
  const query = (`SELECT * from user where user = '${user}'`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err, null); }
    if (result.rowLength == 0) { return callback(null, 0); }
    const obj ={
      mailboxid: result.rows[0].mailboxid,
    };

    return callback(null, obj);
  });
}


function deleteUser(user, callback) {
  checkIfUserExists(user, (err, userDetail) => {
    mailboxDAO.deleteMailbox(userDetail.mailboxid, (err, result) => {
      if (err) { return callback(err); }
      const query = (`DELETE from user where user = '${user}'`);
      client.execute(query, (error, result) => {
        if (error) { return callback(error); }
        return callback(null, { message: userDetail });
      });
    });
  });
}


module.exports = {
  createDomain,
  deleteDomain,
  checkIfDomainExists,
  createUser,
  deleteUser,
  checkIfUserExists,
};

