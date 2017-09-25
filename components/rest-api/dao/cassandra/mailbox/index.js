const start = require('../../../db');
const config = require('../../../config');

const client = start.client;
const uuid = start.uuid;

// Function to create a mailbox which contains id

function createMailbox(callback) {
  const newMailbox = {
    mailboxId: uuid().toString(),
  };
  const query = ('INSERT INTO mailbox (mailboxId) values( ? )');
  client.execute(query, [newMailbox.mailboxId], (err) => {
    if (err) { return callback(err, null); }
    return callback(null, newMailbox);
  });
}

function checkIfMailboxExists(mailboxId, callback) {
  const query = (`SELECT * from mailbox where mailboxId = ${mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(null, result.rowLength > 0);
  });
}
// Function to delete the mailbox with id. If id not exists returns no mailbox error
function deleteMailbox(mailboxId, callback) {
  const query = (`DELETE from  mailbox where mailboxId = ${mailboxId}`);
  client.execute(query, (error) => {
    if (error) { callback(error, null); }
    return callback(null, mailboxId);
  });
}


function getAllMailboxes(limit, callback) {
  if (limit === 0) {
    callback('limit is set to 0', null);
  } else if (limit === -1) {
    const query = ('SELECT * from mailbox');
    client.execute(query, (error, result) => {
      if (error) { callback(error, null); return; }
      const a = result.rows.length;
      const b = result.rows;
      callback(null, { a, b });
    });
  } else if (limit === undefined) {
    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from mailbox limit ${defaultLimit}`);
    client.execute(query, (error, result) => {
      if (error) { callback(error, null); return; }
      const a = result.rows.length;
      const b = result.rows;
      callback(null, { a, b });
    });
  } else {
    const query = (`SELECT * from mailbox limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) { callback(error, null); return; }
      const a = result.rows.length;
      const b = result.rows;
      callback(null, { a, b });
    });
  }
}

module.exports = {
  createMailbox,
  checkIfMailboxExists,
  deleteMailbox,
  getAllMailboxes,
};
