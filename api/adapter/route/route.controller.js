const client = require('../../../client/kafkaclient').client;
const eventService = require('../../../services/event');

function checkStatus(req, res) {
  const event = {
    user: req.params.user,
    status: req.params.status,
  };
  eventService.sendevent(event);
  res.status(201).json(event);
}
module.exports = {
  checkStatus,
};

