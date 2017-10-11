const router = require('express').Router();

const controller = require('./circle.controller');

router.post('/domain/:domain', controller.createDomain);
router.delete('/domain/:domain', controller.deleteDomain);

module.exports = router;
