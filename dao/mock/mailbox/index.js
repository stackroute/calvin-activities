const mailboxes = [];
let idCounter = 0;

// Function to create a mailbox which contains id

function createMailbox(callback) {
  idCounter = (parseInt(Math.random()*192)).toString();
  mailboxes.push(idCounter);
  return callback(null, idCounter);
}

function checkIfMailboxExists(mailboxId, callback) {
  const filteruserid = mailboxes.filter(userid => userid === mailboxId);
  return callback(null, filteruserid.length!==0);
}


function deleteMailbox(mailboxId, callback) {
  checkIfMailboxExists(mailboxId, (err, MailboxExists) => {
    if (err) { return callback(err, null); }
    if (MailboxExists === false) {
      return callback(`Mailbox id ${mailboxId} does not exist`, null);
    } else {
      const filter = mailboxes.filter(y => y ===mailboxId);
      mailboxes.splice(mailboxes.indexOf(filter[0]), 1);
      return callback(null, filter[0]);
    }
  });
}

module.exports = {
  createMailbox,
  deleteMailbox,
  checkIfMailboxExists,
};
