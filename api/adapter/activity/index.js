const router = require('express').Router();

const controller = require('./activity.controller');

router.post('/domain/:domain/activity', controller.publishActivityToDomain);
router.post('/user/:user/activity', controller.publishActivityToUser);
router.get('/getallactivities/user/:user', controller.getAllActivitiesForUser);
router.get('/getallactivities/domain/:domain', controller.getAllActivitiesForDomain);
module.exports = router;

