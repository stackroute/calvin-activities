const router = require('express').Router();

const controller = require('./route.controller');

router.post('/user/:user/status/:status', controller.checkStatusForUser);

router.post('/domain/:domain/status/:status', controller.checkStatusForCircle);

module.exports = router;
