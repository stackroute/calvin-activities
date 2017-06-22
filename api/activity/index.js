const router = require('express').Router();

const controller = require('./activity.controller');

const authorize = require('../../authorize');

// For circle
router.post('/:circleId/activity', authorize.permit('circle:all', 'circle:publish'), controller.createPublishActivity);

// For mailbox
router.post('/:mailboxId/activitytomailbox', authorize.permit('mailbox:all', 'mailbox:read'), controller.createPublishActivityToMailbox);

// Receive message from mailbox
module.exports = router;
