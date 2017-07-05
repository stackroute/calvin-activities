/* eslint prefer-arrow-callback:0, func-names:0 */
const app = require('../../app');

const l1rService = require('../../services/l1r');

require('chai').should();

const request = require('supertest');

const start=require('../../db');

const uuid = start.uuid;

const thunk = require('thunks')()

const redis = require('thunk-redis');

const client = redis.createClient();

describe('L1R routes api', function () {
  let circleId;
  let multiplexerId;
  const checkIfCircleIdPresentinCache = thunk.thunkify(l1rService.checkIfCircleIdPresentinCache);
  const checkIfrouteExists = thunk.thunkify(l1rService.checkIfrouteExists);
  const addRoute = thunk.thunkify(l1rService.addRoute);
  const getRoutesList = thunk.thunkify(l1rService.getRoutesList);
  const getRoutesForCircle = thunk.thunkify(l1rService.getRoutesForCircle);
  const deleteRoute = thunk.thunkify(l1rService.deleteRoute);

  before(function (done) {
    circleId = uuid();
    multiplexerId = Math.floor(Math.random()*50);
    done();
  });

  after(function (done) {
    client.flushall()(function(err, res){
        done();
    });
  });
  it('should add new route between circle and multiplexer if already does not exists',function(done) {
    checkIfCircleIdPresentinCache({ circleId })(function(err, result){
      if(err) { throw err; }
      result.should.be.equal(true);
      if(result)
        return checkIfrouteExists({circleId, multiplexerId})
    })(function (err, result){
      result.should.be.equal(false);
      if(err) { throw err; }
      if(!result)
      request(app)
      .post(`/l1route/${circleId}/${multiplexerId}`)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((error,res) => {
        res.body.should.have.property('result');
        (res.body.result).should.be.equal(1);
        done();
      });  
    })
  });
    it('should fail to add new route between circle and multiplexer if already exists',function(done) {
    checkIfCircleIdPresentinCache({ circleId })(function(err, result){
      if(err) { throw err; }
      result.should.be.equal(true);
      if(result)  
        return checkIfrouteExists({circleId, multiplexerId})
      })(function (err, result){
      result.should.be.equal(false);
      if(err) { throw err; }
      if(!result)  
        return addRoute({circleId, multiplexerId})
      })(function (err, result){
      if(err) { throw err; }
      if(result)
        return checkIfrouteExists({circleId, multiplexerId})
      })(function (err, result){
      result.should.be.equal(true);
      if(err) { throw err; }
      if(result)  
      request(app)
      .post(`/l1route/${circleId}/${multiplexerId}`)
      .expect(409)
      .expect('Content-Type', /json/)
      .end((error,res) => {
        res.body.should.have.property('message');
        (res.body.message).should.be.equal(`Route between circle with id ${circleId} and multiplexer with id ${multiplexerId} already exists`);
        done();
      });  
    })
  });
});

