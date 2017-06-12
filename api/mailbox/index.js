const router = require('express').Router();
const controller = require('./mailbox.controller');

router.post('/', controller.createNewMail);
router.get('/', controller.retrieveAllMail);
router.get('/:id', controller.retrievemail);
router.delete('/:id', controller.deletemail);

module.exports = router;
