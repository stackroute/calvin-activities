const client = require('../../client/kafkaclient').client;
const eventService = require('../../services/event');


function checkStatusForMailbox(req, res) {
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
  const msg = {
    mailboxId: req.params.mailboxId,
    event: eventName,
  };
  eventService.sendevent(msg);
  res.status(201).json(msg);
}

function checkStatusForCircle(req, res) {
  let eventName =null;
  if(req.params.status === 'add'){
    eventName = 'addcircle'; 
  }
  else if (req.params.status === 'remove'){
    eventName = 'removecircle';
  }
  const event = {
    circleId: req.params.circleId,
    event: eventName,
  };
  eventService.sendevent(event);
  res.status(201).json(event);
}



module.exports = {

  checkStatusForMailbox,checkStatusForCircle,

};
