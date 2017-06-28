const mailboxDao = require('../../dao').mailbox;

function createMailbox(req, res) {
  mailboxDao.createMailbox((err, newMailbox) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(201).json({ newMailbox });
  });
}

function deleteMailbox(req, res) {
  mailboxDao.checkIfMailboxExists(req.params.mailboxId, (error, doesMailboxExists) => {
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesMailboxExists) {
      res.status(404).json({ message: `${error}` });
      return;
    }
    mailboxDao.deleteMailbox(req.params.mailboxId, (err, deletedMailbox) => {
      if (err) { res.status(404).json({ message: `${err}` }); return; }
      res.status(200).json({ deletedMailbox });
    });
  });
}

module.exports = {
  createMailbox,
  deleteMailbox,
};

