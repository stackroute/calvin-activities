const router = require('express').Router();

const controller = require('./circle.controller');

router.get('/', controller.retrieveAllCircles);
// router.get('/:id', controller.retrieveCircle);
router.post('/', controller.createNewCircle);
// router.put('/:id', controller.updateCircle);
router.delete('/:id', controller.deleteCircle);

module.exports = router;
