/* eslint prefer-arrow-callback:0, func-names:0 */
const app = require('../../app');

const expect = require('chai').expect;

require('chai').should();

const request = require('supertest');

const circleDAO = require('../../dao').circle;

const authorize = require('../../authorize');
describe('/circle api', function () {
  let circleId;
  let token;
  before(function (done) {
    token = authorize.generateJWTToken();
    done();
  });

  it('it should create a circle', function (done) {
    request(app)
      .post('/circle')
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) { done(err); return; }
        expect(res.body).to.be.an('object').to.have.property('circleId');
        expect(res.body).to.be.an('object').to.have.property('mailboxId');
        expect(res.body).to.be.an('object').to.have.property('createdOn');
        circleId = res.body.circleId;
        circleDAO.checkIfCircleExists(circleId, (error, circleExists) => {
          if (err) { done(err); return; }
          circleExists.should.be.equal(true);
          done();
        });
      });
  });

  it('should delete a circle', (done) => {
    circleDAO.checkIfCircleExists(circleId, (err, doesCircleExists) => {
      if (err) { done(err); return; }
      doesCircleExists.should.be.equal(true);
      request(app)
        .delete(`/circle/${circleId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err1, res) => {
          if (err1) { done(err1); return; }
          expect(res.body.id).to.equal(circleId);
          circleDAO.checkIfCircleExists(circleId, (error, circleExists) => {
            if (err) { done(err); return; }
            circleExists.should.be.equal(false);
            done();
          });
        });
    });
  });

  it('should fail when we try to delete a circle id that does not exist', (done) => {
    circleDAO.checkIfCircleExists(circleId, (err, doesCircleExists) => {
      if (err) { done(err); return; }
      doesCircleExists.should.be.equal(false);
      request(app)
        .delete(`/circle/${circleId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err1, res) => {
          if (err1) { done(err1); } else {
            circleDAO.checkIfCircleExists(circleId, (error, circleExists) => {
              if (error) { done(error); return; }
              circleExists.should.be.equal(false);
              done();
            });
          }
        });
    });
  });

  it('should return circle with limit', (done) => {
    request(app)
      .get('/circle/getallcircles?limit=5')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err1, res) => {
        expect(res.body.totalItems).to.be.equal(5);
        for (let i = 0; i < 5; i += 1) {
          expect(res.body.items[i]).to.be.an('object').to.have.property('circleid');
          expect(res.body.items[i]).to.be.an('object').to.have.property('mailboxid');
          expect(res.body.items[i]).to.be.an('object').to.have.property('lastpublishedactivity');
          expect(res.body.items[i]).to.be.an('object').to.have.property('createdon');
        }
        done();
      });
  });
  it('should return circle without limit', (done) => {
    request(app)
      .get('/circle/getallcircles')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err1, res) => {
        expect(res.body.totalItems).to.be.above(0);
        for (let i = 0; i < res.body.totalItems; i += 1) {
          expect(res.body.items[i]).to.be.an('object').to.have.property('circleid');
          expect(res.body.items[i]).to.be.an('object').to.have.property('mailboxid');
          expect(res.body.items[i]).to.be.an('object').to.have.property('lastpublishedactivity');
          expect(res.body.items[i]).to.be.an('object').to.have.property('createdon');
        }
        done();
      });
  });
});

