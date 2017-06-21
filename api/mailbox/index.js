const router = require('express').Router();
const controller = require('./mailbox.controller');

const authorize = require('../../authorize');

router.post('', authorize.permit('mailbox:all', 'mailbox:create'), controller.createMailbox);
router.delete('/:id', authorize.permit('mailbox:all', 'mailbox:delete'), controller.deleteMailbox);

module.exports = router;
