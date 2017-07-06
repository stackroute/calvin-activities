const routesService = require('../../services/routes');

const multiplexerService = require('../../services/multiplexer');



function createRoute(req, res) {
    routesService.createRoute(req.params.circleId, req.params.userId, (err, result) => {
        console.log(`result of createRoute:${result}`);
        if (err) { res.status(500).send({ message: `${err}` }); return; }
         res.send({ message:`${result}`}); 
    });
}


multiplexerService.getAllMultiplexer((err, result) => {
    console.log([result]);
      console.log([result.m1]);
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(201).json(result);

    
// function deleteRoute() {

// }

// function getAllRoutes() {

// }

module.exports = {
 createRoute,   
}