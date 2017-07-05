const router = require('express').Router();
const controller = require('./multiplexer.controller');

// const authorize = require('../../authorize');

// router.post('/:mx', authorize.permit('multiplexer:all', 'multiplexer:create'), controller.createMultiplexer);
// router.delete('/:mx', authorize.permit('multiplexer:all', 'multiplexer:delete'), controller.deleteMultiplexer);
// router.get('/', authorize.permit('multiplexer:all', 'multiplexer:get'), controller.getAllMultiplexer);


router.post('/:mx', controller.createMultiplexer);
router.delete('/:mx', controller.deleteMultiplexer);
router.get('/', controller.getAllMultiplexer);

module.exports = router;
