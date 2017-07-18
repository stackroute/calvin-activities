/* eslint prefer-arrow-callback:0, func-names:0 */
const app = require('../../app');

const multiplexerRouteService = require('../../services/multiplexer-route');

require('chai').should();

const request = require('supertest');

const start=require('../../db');

const uuid = start.uuid;

describe('multiplexer routes Api', function () {
  let namespace;
  let circleId;
  let mailboxId;

  before(function (done) {
    namespace = Math.floor(Math.random()*50);
    circleId = uuid();
    mailboxId = uuid();
    done();
  });
  it('should add new route between,circle and mailbox if it does not exist', (done) => {
    multiplexerRouteService.checkIfRouteExists({ namespace, circleId, mailboxId }, (err, doesRouteExist) => {
      if (err) { throw err; }
      doesRouteExist.should.be.equal(false);
      request(app)
        .post(`/multiplexerRoute/${namespace}/${circleId}/${mailboxId}`)
        .expect(201)
        .expect('Content-Type', /json/)
        .end((error, res) => {
          if (error) { done(error); return; }
          res.body.should.have.property('result');
          (res.body.result).should.be.equal(1);
          multiplexerRouteService.checkIfRouteExists({ namespace, circleId, mailboxId }, (err1, doesRouteExistAfter) => {
            doesRouteExistAfter.should.be.equal(true);
            done();
          });
        });
    });
  });

  it('should fail to add route between circle and mailbox if it already exists', (done) => {
    multiplexerRouteService.checkIfRouteExists({ namespace, circleId, mailboxId }, (err, doesRouteExist) => {
      if (err) { throw err; }
      doesRouteExist.should.be.equal(true);
      request(app)
        .post(`/multiplexerRoute/${namespace}/${circleId}/${mailboxId}`)
        .expect(409)
        .expect('Content-Type', /json/)
        .end((error, res) => {
          if (error) { done(error); return; }
          res.body.should.have.property('message');
          (res.body.message).should.be.equal(`Route between circle with id ${circleId} and mailbox with id ${mailboxId} already exists`);
          done();
        });
    });
  });

  it('should delete the route between circle and mailbox if already exists', (done) => {
    multiplexerRouteService.checkIfCircleIsPresentinCache({ circleId }, (err, result) => {
      if (err) { throw err; }
      result.should.be.equal(0);
      multiplexerRouteService.checkIfRouteExists({ namespace, circleId, mailboxId }, (err1, doesRouteExist) => {
        if (err1) { throw err1; }
        doesRouteExist.should.be.equal(true);
        request(app)
          .delete(`/multiplexerRoute/${namespace}/${circleId}/${mailboxId}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((error, res) => {
            if (error) { done(error); return; }
            res.body.should.have.property('result');
            (res.body.result).should.be.equal(1);
            multiplexerRouteService.checkIfRouteExists({ namespace, circleId, mailboxId }, (err2, doesRouteExistAfter) => {
              doesRouteExistAfter.should.be.equal(false);
              done();
            });
          });
      });
    });
  });

  it('should fail to delete when route between circle and mailbox does not exists', (done) => {
    const randomMailboxId = Math.floor(Math.random()*100);
    multiplexerRouteService.checkIfCircleIsPresentinCache({ circleId }, (err, result) => {
      if (err) { throw err; }
      result.should.be.equal(0);
      multiplexerRouteService.addRoute({ namespace, circleId, mailboxId }, (err1, doesRouteAdded) => {
        if (err1) { throw err1; }
        doesRouteAdded.should.be.equal(1);
        multiplexerRouteService.checkIfRouteExists({ namespace, circleId, mailboxId }, (err2, doesRouteExist) => {
          if (err2) { throw err2; }
          doesRouteExist.should.be.equal(true);
          request(app)
            .delete(`/multiplexerRoute/${namespace}/${circleId}/${randomMailboxId}`)
            .expect(404)
            .expect('Content-Type', /json/)
            .end((error, res) => {
              res.body.should.have.property('message');
              (res.body.message).should.be.equal(`circle with id ${circleId} does not have a route for mailbox with id ${randomMailboxId}`);
              done();
            });
        });
      });
    });
  });

  it('should get list of circles having routes', (done) => {
    request(app)
      .get(`/multiplexerRoute/${namespace}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, res) => {
        res.body.should.have.property('result');
        (res.body.result).should.be.a('array');
        done();
      });
  });

  it('should get list of circles having routes', (done) => {
    multiplexerRouteService.checkIfCircleIsPresentinCache({ circleId }, (err, result) => {
      if (err) { throw err; }
      result.should.be.equal(0);
      if (!result) {
        multiplexerRouteService.addRoute({ circleId, mailboxId }, (err1, doesRouteAdded) => {
          if (err1) { throw err1; }
          doesRouteAdded.should.be.equal(true);
          request(app)
            .get(`/multiplexerRoute/${namespace}/${circleId}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((error, res) => {
              res.body.should.have.property('result');
              (res.body.result).should.be.a('array');
            });
        });
        done();
      }
    });
  });

  it('should fail to get list of circles not having routes', (done) => {
    const randomCircleId = uuid();
    multiplexerRouteService.checkIfCircleIsPresentinCache({ circleId: randomCircleId }, (err, result) => {
      if (err) { throw err; }
      result.should.be.equal(0);
      request(app)
        .get(`/multiplexerRoute/${namespace}/${randomCircleId}`)
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

