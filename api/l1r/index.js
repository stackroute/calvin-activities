const router = require('express').Router();

const controller = require('../l1r/l1r.controller');

router.get('/', controller.getRoutesList);
router.get('/:circleId', controller.getRoutesForCircle);
router.post('/:circleId/:multiplexerId', controller.addRoute);
router.delete('/:circleId/:multiplexerId', controller.deleteRoute);

module.exports = router;
