const routesService = require('../../services/routes');
const namespace = require('../../config').namespace;
const multiplexerService = require('../../services/multiplexer');
const l1rService = require('../../services/l1r');
const multiplexerRouteService = require('../../services/multiplexer-route');

function createRoute(req, res) {
  routesService.addRoute(req.params.circleId, req.params.userId, (err, result) => {
    if (result === 'No multiplexer available') { res.status(404).json({ message: 'No multiplexers available' }); }
    if (result === 'Routes added') { res.status(201).json({ message: 'Routes added' }); }
    if (err) { res.status(500).send({ message: `${err}` }); }
  });
}

function deleteRoute(req, res) {
  const circleId = req.params.circleId;
  const mailboxId = req.params.userId;
  routesService.removeRoute(circleId, mailboxId, (err4, result) => {
    if (result === "del") { res.status(201).json({ message: 'Routes deleted' }); }
    if (err4) { res.status(500).json({ message: `${err4}` }); }
  });
}


module.exports = {
  createRoute,
  deleteRoute,
};
