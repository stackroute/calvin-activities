const router = require('express').Router();

const controller = require('./follow.controller');

router.post('/user/:user/domain/:domain', controller.addFollow);
router.delete('/user/:user/domain/:domain', controller.deleteFollow);

module.exports = router;
