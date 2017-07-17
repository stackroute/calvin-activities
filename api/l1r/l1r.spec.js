/* eslint prefer-arrow-callback:0, func-names:0 */
const app = require('../../app');

const l1rService = require('../../services/l1r');

require('chai').should();

const request = require('supertest');

const start=require('../../db');

const uuid = start.uuid;

const thunk = require('thunks')();

const redis = require('thunk-redis');

const client = redis.createClient();

describe('L1R routes api', function () {
  let circleId;
  let multiplexerId;
  const checkIfCircleIsPresentinCache = thunk.thunkify(l1rService.checkIfCircleIsPresentinCache);
  const checkIfRouteExists = thunk.thunkify(l1rService.checkIfRouteExists);
  const addRoute = thunk.thunkify(l1rService.addRoute);


  before(function (done) {
    circleId = uuid();
    multiplexerId = Math.floor(Math.random()*50);
    done();
  });

  afterEach(function (done) {
    client.flushall()(function (err, res) {
      done();
    });
  });
  it('should add new route between circle and multiplexer if already does not exists', function (done) {
    checkIfCircleIsPresentinCache({ circleId })(function (err, result) {
      if (err) { throw err; }
      result.should.be.equal(0);
      if (!result) { return checkIfRouteExists({ circleId, multiplexerId }); } else { done(); return 0; }
    })(function (err, result) {
      result.should.be.equal(false);
      if (err) { throw err; }
      request(app)
        .post(`/l1route/${circleId}/${multiplexerId}`)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((error, res) => {
          res.body.should.have.property('result');
          (res.body.result).should.be.equal(1);
          done();
        });
    });
  });

  it('should fail to add new route between circle and multiplexer if already exists', function (done) {
    checkIfCircleIsPresentinCache({ circleId })(function (err, result) {
      if (err) { throw err; }
      result.should.be.equal(0);
      if (!result) { return checkIfRouteExists({ circleId, multiplexerId }); } else { done(); return 0; }
    })(function (err, result) {
      result.should.be.equal(false);
      if (err) { throw err; }
      if (!result) { return addRoute({ circleId, multiplexerId }); } else { done(); return 0; }
    })(function (err, result) {
      if (err) { throw err; }
      if (result) { return checkIfRouteExists({ circleId, multiplexerId }); } else { done(); return 0; }
    })(function (err, result) {
      if (err) { throw err; }
      result.should.be.equal(true);
      request(app)
        .post(`/l1route/${circleId}/${multiplexerId}`)
        .expect(409)
        .expect('Content-Type', /json/)
        .end((error, res) => {
          res.body.should.have.property('message');
          (res.body.message).should.be.equal(`Route between circle with id ${circleId} and multiplexer with id ${multiplexerId} already exists`);
          done();
        });
    });
  });

  it('should delete the route between circle and multiplexer if already does not exists', function (done) {
    checkIfCircleIsPresentinCache({ circleId })(function (err, result) {
      if (err) { throw err; }
      result.should.be.equal(0);
      if (!result) { return checkIfRouteExists({ circleId, multiplexerId }); } else { done(); return 0; }
    })(function (err, result) {
      result.should.be.equal(false);
      if (err) { throw err; }
      if (!result) { return addRoute({ circleId, multiplexerId }); } else { done(); return 0; }
    })(function (err, result) {
      if (err) { throw err; }
      request(app)
        .delete(`/l1route/${circleId}/${multiplexerId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((error, res) => {
          res.body.should.have.property('result');
          (res.body.result).should.be.equal(1);
          done();
        });
    });
  });

  it('should fail to delete when route between circle and multiplexer does not exists', function (done) {
    const randomMultiplexerid = Math.floor(Math.random()*100);
    checkIfCircleIsPresentinCache({ circleId })(function (err, result) {
      if (err) { throw err; }
      result.should.be.equal(0);
      if (!result) { return addRoute({ circleId, multiplexerId }); } else { done(); return 0; }
    })(function (err, result) {
      if (err) { throw err; }
      if (result) { return checkIfRouteExists({ circleId, multiplexerId }); } else { done(); return 0; }
    })(function (err, result) {
      result.should.be.equal(true);
      if (err) { throw err; }
      request(app)
        .delete(`/l1route/${circleId}/${randomMultiplexerid}`)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((error, res) => {
          res.body.should.have.property('message');
          (res.body.message).should.be.equal(`circle with id ${circleId}
      does not have a route for multiplexer with id ${randomMultiplexerid}`);
          done();
        });
    });
  });

  it('should get List of circles having routes', function (done) {
    request(app)
      .get('/l1route/')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, res) => {
        res.body.should.have.property('result');
        (res.body.result).should.be.a('array');
        done();
      });
  });

  it('should get List of circles having routes', function (done) {
    checkIfCircleIsPresentinCache({ circleId })(function (err, result) {
      if (err) { throw err; }
      result.should.be.equal(0);
      if (!result) { return addRoute({ circleId, multiplexerId }); } else { done(); return 0; }
    })(function (err, result) {
      if (err) { throw err; }
      request(app)
        .get(`/l1route/${circleId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((error, res) => {
          res.body.should.have.property('result');
          (res.body.result).should.be.a('array');
          done();
        });
    });
  });

  it('should fail to get List of multiplexers of a circle having routes', function (done) {
    const randomCircleId = uuid();
    checkIfCircleIsPresentinCache({ circleId: randomCircleId })(function (err, result) {
      if (err) { throw err; }
      result.should.be.equal(0);
      request(app)
        .get(`/l1route/${randomCircleId}`)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((error, res) => {
          res.body.should.have.property('message');
          (res.body.message).should.be.equal(`Route for circle with id ${randomCircleId} does not exists`);
          done();
        });
    });
  });
});
