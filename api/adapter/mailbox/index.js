const router = require('express').Router();

const controller = require('./mailbox.controller');

router.post('/user/:user', controller.createUser);
router.delete('/user/:user', controller.deleteUser);

module.exports = router;
