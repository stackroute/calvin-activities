const router = require('express').Router();
const controller = require('./activity.controller');
// For circle
router.post('/:circleId/activity', controller.createPublishActivity);

// Receive message from mailbox
router.get('/:mailboxId/activity', controller.getActivity);
module.exports = router;
