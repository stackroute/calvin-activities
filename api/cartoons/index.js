const router = require('express').Router();
const controller = require('./cartoons.controller');

router.get('/', controller.retrieveAllCartoons);
router.get('/:id', controller.retrieveCartoon);
router.post('/', controller.createNewCartoon);
router.put('/:id', controller.updateCartoon);
router.delete('/:id', controller.deleteCartoon);

module.exports = router;