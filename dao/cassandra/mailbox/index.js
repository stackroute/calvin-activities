const start = require('../../../db');

const client = start.client;
const uuid = start.uuid;

// Function to create a mailbox which contains id

function createMailbox(callback) {
  const newMailbox = {
    mailboxId: uuid().toString(),
  };
  const query = ('INSERT INTO mailbox (mailboxId) values( ? )');
  client.execute(query, [newMailbox.mailboxId], (err, result) => {
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
  client.execute(query, (error, result) => {
    if (error) { callback(error, null); }
    return callback(null, mailboxId);
  });
}


module.exports = {
  createMailbox,
  checkIfMailboxExists,
  deleteMailbox,
};
