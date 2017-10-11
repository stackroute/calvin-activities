const mailboxDao = require('../../dao/').mailbox;

function createMailbox(req, res) {
  mailboxDao.createMailbox((err, newMailbox) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(201).json(newMailbox);
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
      res.status(200).json({ mailboxId: `${deletedMailbox}` });
    });
  });
}

function getAllMailboxes(req, res) {
  mailboxDao.getAllMailboxes(req.query.limit, (err, result) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(201).json({ totalItems: result.a, items: result.b });
  });
}


module.exports = {
  createMailbox,
  deleteMailbox,
  getAllMailboxes,
};

