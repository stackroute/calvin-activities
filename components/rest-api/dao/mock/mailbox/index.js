const mailboxes = [];
const result = [];
const start=require('../../../db');

const config = require('../../../config');

const uuid = start.uuid;

function createMailbox(callback) {
  const newMailbox = {
    mailboxId: uuid().toString(),
  };
  mailboxes.push(newMailbox);
  return callback(null, newMailbox);
}
function checkIfMailboxExists(mailboxId, callback) {
  const filterMailbox = mailboxes.filter(mailbox => mailbox.mailboxId === mailboxId);
  return callback(null, filterMailbox.length!==0);
}
function deleteMailbox(mailboxId, callback) {
  const filter = mailboxes.filter(mailbox => mailbox.mailboxId === mailboxId);
  mailboxes.splice(mailboxes.indexOf(filter[0]), 1);
  return callback(null, filter[0].mailboxId);
}

function getAllMailboxes(limit, callback) {
  if (limit === 0) {
    return callback('limit is set to 0', null);
  } else if (limit === -1) {
    const a = mailboxes.length;
    const b = mailboxes;
    return callback(null, { a, b });
  } else if (limit === undefined) {
    const defaultLimit = config.defaultLimit;
    for (let i = 0; i < defaultLimit; i += 1) {
      result.push(mailboxes[i]);
    }
    const a = result.length;
    const b = result;
    return callback(null, { a, b });
  } else {
    for (let i = 0; i < limit; i +=1) {
      result.push(mailboxes[i]);
    }
    const a = result.length;
    const b = result;
    return callback(null, { a, b });
  }
}

module.exports = {
  createMailbox,
  deleteMailbox,
  checkIfMailboxExists,
  getAllMailboxes,
};
