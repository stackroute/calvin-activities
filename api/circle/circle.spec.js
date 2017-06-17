/* eslint prefer-arrow-callback:0, func-names:0 */
const app = require('../../app');

require('chai').should();

const request = require('supertest');

const circleDAO = require('../../dao/circle');

const JWT = require('jwt-async');

const jwt = new JWT();

const configFile = require('fs').readFileSync('secret.json');

const config = JSON.parse(configFile);

jwt.setSecret(config.secretKey);

describe('/circle api', function () {
  let circleId;
  let token;
  before(function (done) {
    jwt.sign({ someClaim: 'data' }, function (err, data) {
      if (err) { return err; }
      token = data;
      return data;
    });
    done();
  });
  it('it should create a new circle', function (done) {
    request(app)
      .post('/circle/')
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) { done(err); return; }
        res.body.should.have.property('id').equal(res.body.id).a('string');
        circleId=res.body.id;
        circleDAO.checkIfCircleExists(circleId).should.be.equal(true);
        done();
      });
  });

  it('should delete a circle', function (done) {
    circleDAO.checkIfCircleExists(circleId).should.be.equal(true);
    request(app)
      .delete(`/circle/${circleId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) { done(err); return; }
        res.body.should.have.property('id').equal(res.body.id).a('string');
        circleDAO.checkIfCircleExists(circleId).should.be.equal(false);
        done();
      });
  });

  it('should fail when we try to delete a circle id that does not exist', function (done) {
    circleDAO.checkIfCircleExists(circleId).should.be.equal(false);
    request(app)
      .delete(`/circle/${circleId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Circle id ${circleId} does not exist`);
        circleDAO.checkIfCircleExists(circleId).should.be.equal(false);
        done();
      });
  });
});
