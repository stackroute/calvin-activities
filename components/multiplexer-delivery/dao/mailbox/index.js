const client = require('../../client/dseclient').client;

function checkIfMailboxExists(mailboxId, callback) {
  const query = (`SELECT * from mailbox where mailboxId = ${mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(null, result.rowLength > 0);
  });
}

module.exports = {
  checkIfMailboxExists,
};
