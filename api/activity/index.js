const router = require('express').Router();
const controller = require('./activity.controller');
// For circle
router.post('/:circleId/activity', controller.createPublishActivity);

// For mailbox
router.post('/:mailboxId/activitytomailbox', controller.createPublishActivityToMailbox);

// Receive message from mailbox
router.get('/:mailboxId/activity', controller.getActivity);
module.exports = router;
