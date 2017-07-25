const multiplexerService = require('../../services/multiplexer');

function createMultiplexer(req, res) {
  multiplexerService.checkIfMultiplexerExists(req.params.mx, (err, exists) => {
    if (exists === 1) { res.status(409).send({ message: `Multiplexer ${req.params.mx} is already exists` }); return; }
    multiplexerService.createMultiplexer(req.params.mx, (err1, result) => {
      if (result === 'OK') { res.status(201).send({ message: `Multiplexer ${req.params.mx} created` }); } else { res.status(500).json({ message: `${err}` }); }
    });
  });
}

function deleteMultiplexer(req, res) {
  multiplexerService.getMultiplexerCount(req.params.mx, (err, result) => {
    console.log(result);
    if (result > 1){
      multiplexerService.decrementMultiplexerCount(req.params.mx, (err, result1) => {
        if (err) { res.status(500).send({ message: `${err}` }); return; }
        res.status(201).send({ message: `Multiplexer ${req.params.mx} decremented` });
      });
    }
     else{ 
       multiplexerService.deleteMultiplexer(req.params.mx, (err, result2) => {
      if (err) { res.status(500).send({ message: `${err}` }); return; }
    res.status(201).send({ message: `Multiplexer ${req.params.mx} deleted` });
  });
   }
 });
}


function getAllMultiplexer(req, res) {
  multiplexerService.getAllMultiplexer((err, result) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(201).json(result);
  });
}


module.exports = {
  createMultiplexer,
  deleteMultiplexer,
  getAllMultiplexer,
};
