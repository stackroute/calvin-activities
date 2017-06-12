const router = require('express').Router();
const controller = require('./follow.controller');

router.get('/', controller.retrieveAlldata);
router.get('/cid/:mid', controller.getCircleName);
router.get('/mid/:cid', controller.getMailboxId);
router.delete('/circles/:cid/:mid', controller.unfollow);
router.post('/', controller.createNewuser);

module.exports = router;
