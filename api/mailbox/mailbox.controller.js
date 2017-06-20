
const mailboxDao = require('../../dao_mock/mailbox');

function createMailbox(req, res) {
  mailboxDao.createMailbox((err, id) => {
    if (err) { res.status(404).json({ message: `${err}` }); return; }
    res.status(201).json(id);
  });
}

function deleteMailbox(req, res) {
  mailboxDao.deleteMailbox(req.params.mailboxId, (err, id) => {
    if (err) { res.status(404).json({ message: `${err}` }); return; }
    res.status(200).json(id);
  });
}

module.exports = {
  createMailbox,
  deleteMailbox,
};
