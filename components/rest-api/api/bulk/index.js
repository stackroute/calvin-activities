const router = require('express').Router();

const controller = require('./bulk.controller');

router.get('/mailboxesopen/:offset/:count', controller.getOpenMailboxes);
router.post('/bulk/:circleId', controller.bulkFollow);
router.get('/mailboxes/:mailboxId' ,controller.getAllCirclesFollowedByMailbox);
module.exports = router;
