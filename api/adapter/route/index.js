const router = require('express').Router();

const controller = require('./route.controller');

router.post('/user/:user/status/:status', controller.checkStatus);

module.exports = router;
