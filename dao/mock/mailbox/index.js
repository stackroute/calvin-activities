const mailboxes = [];
let idCounter = 0;

function createMailbox(callback) {
  idCounter = (parseInt(Math.random()*192)).toString();
  mailboxes.push(idCounter);
  return callback(null, idCounter);
}
function checkIfMailboxExists(mailboxId, callback) {
  const filterMailbox = mailboxes.filter(mailbox => mailbox === mailboxId);
  return callback(null, filterMailbox.length!==0);
}
function deleteMailbox(mailboxId, callback) {
  const filter = mailboxes.filter(y => y === mailboxId);
  mailboxes.splice(mailboxes.indexOf(filter[0]), 1);
  return callback(null, filter[0]);
}


module.exports = {
  createMailbox,
  deleteMailbox,
  checkIfMailboxExists,
};
