const router = require('express').Router();

const controller = require('./circle.controller');

const authorize = require('../../authorize');

router.post('/', authorize.permit('circle:all', 'circle:create'), controller.createCircle);
router.delete('/:circleId', authorize.permit('circle:all', 'circle:delete'), controller.deleteCircle);
router.get('/getallcircles', controller.getAllCircles);
module.exports = router;
