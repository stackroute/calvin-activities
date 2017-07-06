const router = require('express').Router();
const controller = require('./routes.controller');

router.post('/:circleId/:userId', controller.createRoute);
// router.delete('/:circleId/:userId', controller.deleteRoute);
// router.get('/', controller.getAllRoutes);

module.exports = router;
