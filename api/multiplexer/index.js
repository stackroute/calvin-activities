const router = require('express').Router();
const controller = require('./multiplexer.controller');

router.post('/:mx', controller.createMultiplexer);
router.delete('/:mx', controller.deleteMultiplexer);
router.get('/', controller.getAllMultiplexer);

module.exports = router;
