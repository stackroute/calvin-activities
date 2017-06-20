const app = require('../../app');

const expect = require('chai').expect;
require('chai').should();

const request = require('supertest');

const circleDAO = require('../../dao').circle;


describe('/circle api', () => {
  let circleId;
  it('it should create a new circle and mailbox', (done) => {
    request(app)
      .post('/circle/')
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.be.a('string');
        circleId = res.body;
        circleDAO.checkIfCircleExists(circleId, (error, circleExists) => {
          if (err) { done(err); return; }
          circleExists.should.be.equal(true);
          done();
        });
      });
  });

  it('should delete a circle', (done) => {
    circleDAO.checkIfCircleExists(circleId, (err, doesCircleExists) => {
      doesCircleExists.should.be.equal(true);
      request(app)
        .delete(`/circle/${circleId}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err1, res) => {
          if (err1) { done(err1); return; }
          expect(res.body).to.equal(circleId);
          circleDAO.checkIfCircleExists(circleId, (error, circleExists) => {
            circleExists.should.be.equal(false);
            done();
          });
        });
    });
  });

  it('should fail when we try to delete a circle id that does not exist', (done) => {
    circleDAO.checkIfCircleExists(circleId, (err, doesCircleExists) => {
      doesCircleExists.should.be.equal(false);
      request(app)
        .delete(`/circle/${circleId}`)
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
});
