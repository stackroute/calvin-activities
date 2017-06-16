const router = require('express').Router();
const controller = require('./publish.controller');
// For circle
router.post('/circle/:circleId/activity', controller.createPublishActivityCircle);
router.get('/circle/:circleId/activity', controller.getPublishActivityCircle);

// For mailbox
router.get('/mailbox/:mailboxId/activity', controller.getPublishActivityMailbox);
router.post('/mailbox/:mailboxId/activity', controller.createPublishActivityMailbox);


console.log('Inside index');
module.exports = router;
