const router = require('express').Router();

const controller = require('./event.controller');

router.post('/mailboxid/:mailboxId/status/:status', controller.checkStatusForMailbox);


router.post('/circleid/:circleId/status/:status', controller.checkStatusForCircle);

module.exports = router;
