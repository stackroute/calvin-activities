const router = require('express').Router();
const controller = require('./mailbox.controller');

router.post('/', controller.createMailbox);
// router.get('/', controller.retrieveAllMail);
// router.get('/:id', controller.retrieveMailbox);
router.delete('/:id', controller.deleteMailbox);

module.exports = router;
