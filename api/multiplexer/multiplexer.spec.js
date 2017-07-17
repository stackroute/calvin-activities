const app = require('../../app');

const multiplexerService = require('../../services/multiplexer');

const expect = require('chai').expect;

require('chai').should();

const request = require('supertest');

const redis = require('thunk-redis');

const client = redis.createClient();

describe('/multiplexer api', () => {
  let mxId;
  before((done) => {
    mxId = Math.floor(Math.random()*50);
    done();
  });
  after((done) => {
    client.hdel('multiplexer', mxId)((err, res) => {
      done();
    });
  });

  it('it should add a multiplexer', (done) => {
    multiplexerService.checkIfMultiplexerExists(mxId, (err, res) => {
      res.should.be.equal(0);
    });
    request(app)
      .post(`/multiplexer/${mxId}`)
      .expect(201)
      .end((err4, res) => {
        if (err4) { done(err4); return; }
        multiplexerService.checkIfMultiplexerExists(mxId, (err, res1) => {
          res1.should.be.equal(1);
          done();
        });
      });
  });

  it('it should not add multiplexer if it already exists', (done) => {
    multiplexerService.checkIfMultiplexerExists(mxId, (err, res) => {
      res.should.be.equal(1);
      request(app)
        .post(`/multiplexer/${mxId}`)
        .expect(409)
        .end((err1, res1) => {
          if (err1) { done(err1); return; }
          (res1.body.message).should.equal(`Multiplexer ${mxId} is already exists`);
          done();
        });
    });
  });
});
