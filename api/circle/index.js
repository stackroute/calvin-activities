const router = require('express').Router();

const controller = require('./circle.controller');

router.post('/', controller.createCircle);
router.delete('/:circleId', controller.deleteCircle);

module.exports = router;
