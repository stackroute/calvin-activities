const router = require('express').Router();

const controller = require('./bulk.controller');

// router.get('/mailboxesopen/:offset/:count', controller.getOpenMailboxes);

// router.get('/getallcircles/:offset/:count', controller.getAllCircles);

// router.get('/getfollowers/:circleid/:offset/:count', controller.getAllFollowersOfACircle);

router.get('/getallcircles', controller.getAllCircles);
module.exports = router;
