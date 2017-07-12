const router = require('express').Router({ mergeParams: true });

const controller = require('../follow/follow.controller');

const authorize = require('../../authorize');

router.post('/:mailboxId/circle/:circleId', authorize.permit('follow:all', 'follow:create'), controller.follow);
router.delete('/:mailboxId/circle/:circleId', authorize.permit('follow:all', 'follow:delete'), controller.unfollow);
//router.post('/:circleId/bulk', authorize.permit('follow:all', 'follow:create'), controller.bulkFollow);
module.exports=router;
