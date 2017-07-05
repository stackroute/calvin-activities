const routesService = require('../../services/routes');



function createRoute(req, res) {
    routesService.createRoute(req.params.circleId, req.params.userId, (err, result) => {
        console.log(`result of createRoute:${result}`);
        if (err) { res.status(500).send({ message: `${err}` }); return; }
         res.send({ message:`${result}`}); 
    });
}

// function deleteRoute() {

// }

// function getAllRoutes() {

// }

module.exports = {
 createRoute,   
}