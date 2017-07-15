const router = require('express').Router();

const controller = require('./activity.controller');

router.post('/domain/:domain/activity', controller.publishActivityToDomain);
router.post('/user/:user/activity', controller. publishActivityToUser);
router.get('/getAllActivities/user/:user', controller.getAllActivities);

module.exports = router;

