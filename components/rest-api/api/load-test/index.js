const router = require('express').Router();

const controller = require('./load.controller');

router.post('/loadtest', controller.update);

module.exports = router;
