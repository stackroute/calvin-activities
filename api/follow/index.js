const router = require('express').Router();
const controller = require('./follow.controller');

router.post('/circle/:circleId/mailbox/:mailboxId', controller.follow);
router.delete('/circle/:circleId/mailbox/:mailboxId', controller.unfollow);

module.exports = router;
