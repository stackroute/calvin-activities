const router = require('express').Router();

const controller = require('../multiplexer-route/multiplexer-route.controller');

router.get('/:namespace', controller.getRoutesList);
router.get('/:namespace/:circleId', controller.getRoutesForCircle);
router.post('/:namespace/:circleId/:mailboxId', controller.addRoute);
router.delete('/:namespace/:circleId/:mailboxId', controller.deleteRoute);

module.exports = router;
