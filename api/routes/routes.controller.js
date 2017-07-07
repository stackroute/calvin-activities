const routesService = require('../../services/routes');

const multiplexerService = require('../../services/multiplexer');

const l1rService = require('../../services/l1r');

const multiplexerRouteService = require('../../services/multiplexer-route');

const namespace = require('../../config').namespace;


function createRoute(req, res) {
  routesService.createRoute(req.params.circleId, req.params.userId, (err, result) => {
    if (err) { res.status(500).send({ message: `${err}` }); return; }
    routesService.getMultiplexerStatus((error, res1) => {
      const route = {
        circleId: req.params.circleId,
        multiplexerId: res1,
      };
      if (error) { throw error; }
      l1rService.addRoute(route, (err1, res2) => {
        if (err1) { throw err1; }
        multiplexerService.addMultiplexer(res1, (err2, res3) => {
          if (err2) { throw err2; }
          const route1 = {
            namespace: res1,
            circleId: req.params.circleId,
            mailboxId: req.params.userId,
          };
          multiplexerRouteService.addRoute(route1, (err3, res4) => {
            if (err3) { throw err3; }
          });
          res.status(201).json({ message: 'Routes added' });
        });
      });
    });
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
