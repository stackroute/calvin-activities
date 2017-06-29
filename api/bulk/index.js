const router = require('express').Router();

const controller = require('./bulk.controller');

router.get('/usersonline/:offset/:count', controller.getOpenMailboxes);

router.get('/getallcircles/:offset/:count', controller.getAllCircles);

router.get('/getfollowers/:circleid/:offset/:count', controller.getAllFollowersOfACircle);

module.exports = router;
