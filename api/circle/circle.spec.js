require('chai').should();

const app = require('../../app');

const expect = require('chai').expect;
// require('chai').should();
const should = require('chai').should();

const request = require('supertest');


const circleDAO = require('../../dao/circle');

describe('/circle api', () => {
  // const circleId = '1629d450-5279-11e7-a845-d9c5443eaaa0';
  let circleId;
  it('it should create a new circle', (done) => {
    request(app)
      .post('/circle/')
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.be.a('string');
        circleId = res.body.id;
        circleDAO.checkIfCircleExists(circleId, (error, circleExists) => {
          if (err) { done(err); return; }
          circleExists.should.be.equal(true);
          done();
        });
      });
  });

  it('should delete a circle', (done) => {
    request(app)
      .delete(`/circle/${circleId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body.id).to.equal(circleId);
        circleDAO.checkIfCircleExists(circleId, (error, circleExists) => {
          circleExists.should.be.equal(false);
          done();
        });
      });
  });

  it('should fail when we try to delete a circle id that does not exist', (done) => {
    request(app)
      .delete(`/circle/${circleId}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); } else {
          circleDAO.checkIfCircleExists(circleId, (error, circleExists) => {
            if (error) { done(error); return; }
            circleExists.should.be.equal(false);
            done();
          });
        }
      });
  });
});
