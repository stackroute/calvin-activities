const routesService = require('../../services/routes');

const multiplexerService = require('../../services/multiplexer');

const l1rService = require('../../services/l1r');

const multiplexerRouteService = require('../../services/multiplexer-route');

const namespace = require('../../config').namespace;


function createRoute(req, res) {
  routesService.createRoute(req.params.circleId, req.params.userId, (err, result) => {
    if (err) { res.status(500).send({ message: `${err}` }); return; }
    routesService.getMultiplexerStatus((err, res1) => {
      const route = {
        circleId: req.params.circleId,
        multiplexerId: res1,
      };
      l1rService.addRoute(route, (err, res2) => {
        if (err) { throw err; }
        multiplexerService.addMultiplexer(res1, (err, res3) => {
          if (err) { throw err; }
          const route1 = {
            namespace: res1,
            circleId: req.params.circleId,
            mailboxId: req.params.userId,
          };
          multiplexerRouteService.addRoute(route1, (err, res4) => {
            if (err) { throw err; }
          });
          res.status(201).json({ message: 'Routes added' });
        });
      });
    });
  });
}


function deleteRoute(req, res) {
  routesService.createRoute(req.params.circleId, req.params.userId, (err, result) => {
    if (err) { res.status(500).send({ message: `${err}` }); return; }
    routesService.getMultiplexerStatus((err, res1) => {
      const route = {
        circleId: req.params.circleId,
        multiplexerId: res1,
      };
      l1rService.addRoute(route, (err, res2) => {
        if (err) { throw err; }
        multiplexerService.addMultiplexer(res1, (err, res3) => {
          if (err) { throw err; }
          const route1 = {
            namespace: res1,
            circleId: req.params.circleId,
            mailboxId: req.params.userId,
          };
          multiplexerRouteService.addRoute(route1, (err, res4) => {
            if (err) { throw err; }
          });
          res.status(201).json({ message: 'Routes added' });
        });
      });
    });
  });
}

// function getAllRoutes() {

// }


module.exports = {
  createRoute,
};
