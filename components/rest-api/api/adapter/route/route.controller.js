const client = require('../../../client/kafkaclient').client;
const eventService = require('../../../services/event');
const adapterDAO = require('../../../dao/cassandra/adapter');

function checkStatusForUser(req, res) {
  let eventName = null;
  if(req.params.status === 'online'){
    eventName = 'useronline';
  }
  else if (req.params.status == 'offline'){
    eventName = 'useroffline';
  }
  else{
    res.status(500).json({message: 'Not a valid status'});
  }

  adapterDAO.checkIfUserExists(req.params.user, (error1, doesUserExists) => {
    if (error1) { res.status(500).json({ message: `${error1}` }); return; }
    if (!doesUserExists) {
      res.status(404).json({ message: 'User does not exist' });
      return;
    }
    const event = {
      mailboxId: (doesUserExists.mailboxid).toString(),
      event: eventName,
    };
    eventService.sendevent(event);
    res.status(201).json(event);
  });
}

function checkStatusForCircle(req, res) {
  let eventName =null;
  if(req.params.status === 'add'){
    eventName = 'addcircle'; 
  }
  else if (req.params.status === 'remove'){
    eventName = 'removecircle';
  }
  else{
    res.status(500).json({message: 'Not a valid status'});
  }
  
  adapterDAO.checkIfDomainExists(req.params.domain, (error, doesDomainExists) => {
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesDomainExists) {
      res.status(404).json({ message: 'Domain does not exist' });
      return;
    }

    const event = {
      circleId: (doesDomainExists.circleid).toString(),
      event: eventName,
    };
    eventService.sendevent(event);
    res.status(201).json(event);
  });
}
module.exports = {
  checkStatusForUser, checkStatusForCircle,
};

