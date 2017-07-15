const client = require('../../../client/kafkaclient').client;
const eventService = require('../../../services/event');

function checkStatusForUser(req, res) {
  const event = {
    user: req.params.user,
    status: req.params.status,
  };
  eventService.sendevent(event);
  res.status(201).json(event);
}

function checkStatusForCircle(req, res) {
  const event = {
    domain: req.params.domain,
    status: req.params.status,
  }
  eventService.sendevent(event);
  res.status(201).json(event);

}
module.exports = {
  checkStatusForUser, checkStatusForCircle,
};

