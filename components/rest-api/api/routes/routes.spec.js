const multiplexerService = require('../../services/multiplexer');

const l1rService = require('../../services/l1r');

const multiplexerRouteService = require('../../services/multiplexer-route');

const app = require('../../app');

require('chai').should();

const redis = require('thunk-redis');

const client = redis.createClient();

const request = require('supertest');

describe('Routes manager api', () => {
  let circleId;
  let mailboxId;
  let multiplexerId;

  before((done) => {
    circleId = Math.floor(Math.random() * 30);
    mailboxId = Math.floor(Math.random() * 50);
    multiplexerId = 'm1';
    client.flushall()(() => {
      done();
    });
  });

  afterEach((done) => {
    client.flushall()(() => {
      done();
    });
  });


  it('should not create a route if multiplexer does not exists', (done) => {
    multiplexerService.checkIfMultiplexerExists(multiplexerId, (err, result) => {
      result.should.be.equal(0);
      request(app)
        .post(`/routes/${circleId}/${mailboxId}`)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((error, res) => {
          res.body.should.have.property('message');
          (res.body.message).should.contain('No multiplexers available');
          done();
        });
    });
  });


  it('should create a route if multiplexer does not exists', (done) => {
    multiplexerService.addMultiplexer(multiplexerId, () => {
      multiplexerService.checkIfMultiplexerExists(multiplexerId, () => {
        request(app)
          .post(`/routes/${circleId}/${mailboxId}`)
          .expect(201)
          .expect('Content-Type', /json/)
          .end((error, res) => {
            res.body.should.have.property('message');
            (res.body.message).should.contain('Routes added');
            done();
          });
      });
    });
  });

  it('should not delete route if route is not present', (done) => {
    l1rService.checkIfCircleIsPresentinCache(circleId, (err, result) => {
      result.should.be.equal(0);
      request(app)
        .delete(`/routes/${circleId}/${mailboxId}`)
        .expect(500)
        .end((error, res) => {
          res.body.should.have.property('message');
          (res.body.message).should.contain('Routes deleted');
          done();
        });
    });
  });

  it('should delete route if route is present', (done) => {
    multiplexerRouteService.addRoute({ circleId, mailboxId }, (err, result) => {
      result.should.be.equal(1);
      l1rService.addRoute({ circleId, multiplexerId }, (err1, result1) => {
        result1.should.be.equal(1);
        request(app)
          .delete(`/routes/${circleId}/${mailboxId}`)
          .expect(201)
          .end((error, res) => {
            res.body.should.have.property('message');
            (res.body.message).should.contain('Routes deleted');
            done();
          });
      });
    });
  });
});
