const router = require('express').Router();
const controller = require('./mailbox.controller');

const authorize = require('../../authorize');

router.post('', authorize.permit('mailbox:all', 'mailbox:create'), controller.createMailbox);
router.delete('/:mailboxId', authorize.permit('mailbox:all', 'mailbox:delete'), controller.deleteMailbox);
router.get('/getallmailboxes/', controller.getAllMailboxes);
module.exports = router;
