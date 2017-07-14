const multiplexerRouteService = require('../../services/multiplexer-route');

function addRoute(req, res) {
  const newRoute = {
    namespace: req.params.namespace,
    circleId: req.params.circleId,
    mailboxId: req.params.mailboxId,
  };
  multiplexerRouteService.checkIfRouteExists(newRoute, (err, result1) => {
    if (err) { res.status(500).json({ message: err }); return; }
    if (result1) {
      res.status(409).json({ message: `Route between circle with id ${newRoute.circleId} and mailbox with id ${newRoute.mailboxId} already exists` });
      return;
    }
    multiplexerRouteService.addRoute(newRoute, (err1, result) => {
      if (err1) { res.status(404).json({ message: err1 }); return; }
      res.status(201).json({ result });
    });
  });
}

function getRoutesList(req, res) {
  multiplexerRouteService.getRoutesList({ namespace: req.params.namespace }, (err, result) => {
    if (err) { res.status(404).json({ message: err }); return; }
    res.status(200).json({ result });
  });
}

function getRoutesForCircle(req, res) {
  const route = {
    namespace: req.params.namespace,
    circleId: req.params.circleId,
  };

  multiplexerRouteService.checkIfCircleIsPresentinCache(route, (err, result1) => {
    if (err) { res.status(500).json({ message: err }); return; }
    if (!result1) {
      res.status(404).json({ message: `Route for circle with id ${route.circleId} does not exists` });
      return;
    }
    multiplexerRouteService.getRoutesForCircle(route, (err1, result) => {
      if (err1) { res.status(404).json({ message: err }); return; }
      res.status(200).json({ result });
    });
  });
}

function deleteRoute(req, res) {
  const route = {
    namespace: req.params.namespace,
    circleId: req.params.circleId,
    mailboxId: req.params.mailboxId,
  };
  multiplexerRouteService.checkIfCircleIsPresentinCache(route, (err, result1) => {
    if (err) { res.status(500).json({ message: err }); return; }
    if (!result1) {
      res.status(404).json({ message: `Route for circle with id ${route.circleId} does not exists` });
      return;
    }
    multiplexerRouteService.deleteRoute(route, (err1, result) => {
      if (err1) { res.status(404).json({ message: err }); return; }
      if (result) { res.status(200).json({ result }); } else {
        res.status(404).json({ message: `circle with id ${route.circleId} does not have a route for mailbox with id ${route.mailboxId}` });
      }
    });
  });
}

module.exports = {
  addRoute,
  getRoutesList,
  getRoutesForCircle,
  deleteRoute,
};
