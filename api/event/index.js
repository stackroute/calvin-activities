const router = require('express').Router();

const controller = require('./event.controller');

router.post('/mailboxid/:mailboxId/status/:status', controller.checkStatus);

module.exports = router;