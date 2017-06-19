const app = require('../../app');

require('chai').should();

const request = require('supertest');


const circleDAO = require('../../dao/circle');
const mailboxDAO= require('../../dao/mailbox/');

describe('/circle api', () => {
  let circleId;
  it('it should create a new circle and mailbox', (done) => {
    request(app)
      .post('/circle/')
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('id').equal(res.body.id).a('string');
        circleId=res.body.id;
        circleDAO.checkIfCircleExists(circleId).should.be.equal(true);
        mailboxDAO.checkIfMailboxExists(circleId).should.be.equal(true);
        done();
      });
  });

  it('should delete a circle', (done) => {
    circleDAO.checkIfCircleExists(circleId).should.be.equal(true);
    request(app)
      .delete(`/circle/${circleId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('id').equal(res.body.id).a('string');
        circleDAO.checkIfCircleExists(circleId).should.be.equal(false);
        done();
      });
  });

  it('should fail when we try to delete a circle id that does not exist', (done) => {
    circleDAO.checkIfCircleExists(circleId).should.be.equal(false);
    request(app)
      .delete(`/circle/${circleId}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Circle id ${circleId} does not exist`);
        circleDAO.checkIfCircleExists(circleId).should.be.equal(false);
        done();
      });
  });
});
