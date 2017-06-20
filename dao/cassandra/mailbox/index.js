const start = require('../../../db');

const client = start.client;
const uuid = start.uuid;

// Function to create a mailbox which contains id

function createMailbox(callback) {
  const id1 = uuid();
  const query = ('INSERT INTO mailbox (id) values( ? )');
  client.execute(query, [id1], (err, result) => callback(err, id1.toString()));
}

function checkIfMailboxExists(mailboxId, callback) {
  const query = (`SELECT * from mailbox where id = ${mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(null, result.rowLength > 0);
  });
}
// Function to delete the mailbox with id. If id not exists returns no mailbox error
function deleteMailbox(mailboxId, callback) {
  checkIfMailboxExists(mailboxId, (err, mailboxExists) => {
    if (err) { return callback(err, null); }
    if (mailboxExists === false) {
      return callback(`Mailbox id ${mailboxId} does not exist`, null);
    } else {
      const query = (`DELETE from  mailbox where id =${mailboxId}`);
      client.execute(query, (error, result) => callback(err, mailboxId));
      return { mailboxId };
    }
  });
  return (mailboxId);
}


module.exports = {
  createMailbox,
  checkIfMailboxExists,
  deleteMailbox,
};
