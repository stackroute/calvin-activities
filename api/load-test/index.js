const router = require('express').Router();

const controller = require('./load.controller');

const authorize = require('../../authorize');

router.post('/load-test', authorize.permit('circle:all', 'circle:create'), controller.update);

module.exports = router;
