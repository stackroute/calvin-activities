const redis = require('thunk-redis');

const thunk = require('thunks')();

const client = redis.createClient();

function checkIfrouteExists(route, callback){
    client.smembers(`L1R:${route.circleId}`)(function(err, res){
        if(err){ callback(err, null); return; }
        const doesExists = res.filter(data => data === route.multiplexerId);
        console.log(res);
        callback(null, doesExists.length !== 0);    
        });

}

function addRoute(route, callback){
    client.sadd(`L1R:${route.circleId}`, route.multiplexerId)(function(err, res){
        if(err){ callback(err, null); return; }
        return callback(null, res);
    });
}

function getRoutesList(callback){
    client.keys('L1R:*')(function(err, res){
        if(err){ callback(err, null); return; }
        return callback(null, res);
    });
}

function checkIfCircleIdPresentinCache (route, callback){
    client.exists(`L1R:${route.circleId}`)(function(err, res){
        if(err){ callback(err, null); return; }
        return callback(null, res);
    });
}

function getRoutesForCircle(route, callback){
    client.smembers(`L1R:${route.circleId}`)(function(err, res){
        if(err){ callback(err, null); return; }
        return callback(null, res);
    });
}

function deleteRoute(route, callback){
    client.srem(`L1R:${route.circleId}`,route.multiplexerId)(function(err, res){
        if(err){ callback(err, null); return; }
        return callback(null, res);
    });

}

module.exports = {
    addRoute,
    getRoutesForCircle,
    getRoutesList,
    deleteRoute,
    checkIfCircleIdPresentinCache,
    checkIfrouteExists,
}
