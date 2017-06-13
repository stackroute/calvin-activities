const router = require('express').Router();

const controller = require('./circle.controller');

router.get('/', controller.retrieveAllCircles);
router.post('/', controller.createNewCircle);
router.delete('/:id', controller.deleteCircle);
router.post('/:circleId/mailbox/:mailboxId', controller.follow);
router.delete('/:circleId/mailbox/:mailboxId', controller.unfollow);


module.exports = router;
