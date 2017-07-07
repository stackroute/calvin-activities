const routesService = require('../../services/routes');
const namespace = require('../../config').namespace;
const multiplexerService = require('../../services/multiplexer');
const l1rService = require('../../services/l1r');
const multiplexerRouteService = require('../../services/multiplexer-route');

function createRoute(req, res) {
  routesService.addRoute(req.params.circleId, req.params.userId, (err, result) => {
    if (err) { res.status(500).send({ message: `${err}` }); return; }
    res.status(201).json(result);
  });
}

function deleteRoute(req, res) {
  const circleId = req.params.circleId;
  const userId = req.params.userId;
  const multiplexerId = req.params.multiplexerId;
  routesService.deleteRoute(circleId, userId, (err4, result) => {
    if (err4) { res.status(500).send({ message: `${err4}` }); return; }
    const route = {
      circleId: req.params.circleId,
      multiplexerId: req.params.multiplexerId,
    };
    l1rService.deleteRoute(route, (err5, res2) => {
      if (err5) { throw err5; }
      multiplexerService.deleteMultiplexer(multiplexerId, (err6, res3) => {
        if (err6) { throw err6; }
        const route1 = {
          namespace: multiplexerId,
          circleId: req.params.circleId,
          mailboxId: req.params.userId,
        };
        multiplexerRouteService.deleteRoute(route1, (err7, res4) => {
          if (err7) { throw err7; }
        });
        res.status(201).json({ message: 'Routes deleted' });
      });
    });
  });
}


module.exports = {
  createRoute,
  deleteRoute,
};
