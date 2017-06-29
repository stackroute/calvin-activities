const mailboxes = [];
const start=require('../../../db');

const uuid = start.uuid;

function createMailbox(callback) {
  const newMailbox = {
    id: uuid().toString(),
  };
  mailboxes.push(newMailbox);
  return callback(null, newMailbox);
}
function checkIfMailboxExists(mailboxId, callback) {
  const filterMailbox = mailboxes.filter(mailbox => mailbox.id === mailboxId);
  return callback(null, filterMailbox.length!==0);
}
function deleteMailbox(mailboxId, callback) {
  const filter = mailboxes.filter(mailbox => mailbox.id === mailboxId);
  mailboxes.splice(mailboxes.indexOf(filter[0]), 1);
  return callback(null, filter[0]);
}


module.exports = {
  createMailbox,
  deleteMailbox,
  checkIfMailboxExists,
};
