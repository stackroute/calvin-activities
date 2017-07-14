const l1rService = require('../../services/l1r');

function addRoute(req, res) {
  const newRoute = {
    circleId: req.params.circleId,
    multiplexerId: req.params.multiplexerId,
  };
  l1rService.checkIfRouteExists(newRoute, (err, result1) => {
    if (err) { res.status(500).json({ message: err }); return; }
    if (result1) {
      res.status(409).json({ message: `Route between circle with id ${newRoute.circleId} and multiplexer with id ${newRoute.multiplexerId} already exists` });
      return;
    }
    l1rService.addRoute(newRoute, (err1, result) => {
      if (err1) { res.status(404).json({ message: err1 }); return; }
      res.status(201).json({ result });
    });
  });
}

function getRoutesList(req, res) {
  l1rService.getRoutesList((err, result) => {
    if (err) { res.status(404).json({ message: err }); return; }
    res.status(200).json({ result });
  });
}

function getRoutesForCircle(req, res) {
  const circle = {
    circleId: req.params.circleId,
  };

  l1rService.checkIfCircleIsPresentinCache(circle, (err, result1) => {
    if (err) { res.status(500).json({ message: err }); return; }
    if (!result1) {
      res.status(404).json({ message: `Route for circle with id ${circle.circleId} does not exists` });
      return;
    }
    l1rService.getRoutesForCircle(circle, (err1, result) => {
      if (err1) { res.status(404).json({ message: err }); return; }
      res.status(200).json({ result });
    });
  });
}

function deleteRoute(req, res) {
  const route = {
    circleId: req.params.circleId,
    multiplexerId: req.params.multiplexerId,
  };
  l1rService.checkIfCircleIsPresentinCache(route, (err, result1) => {
    if (err) { res.status(500).json({ message: err }); return; }
    if (!result1) {
      res.status(404).json({ message: `Route for circle with id ${route.circleId} does not exists` });
      return;
    }
    l1rService.deleteRoute(route, (err1, result) => {
      if (err1) { res.status(404).json({ message: err }); return; }
      if (result) { res.status(200).json({ result }); } else {
        res.status(404).json({ message: `circle with id ${route.circleId}
      does not have a route for multiplexer with id ${route.multiplexerId}` });
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
