const chai = require('chai');

const should = chai.should();

const request = require('supertest');

const server = request.agent('http://localhost:3000');

describe('/circle api', () => {
  it('it should create a new circle', (done) => {
    server
      .post('/circles')
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(201);
        done();
      });
  });

  it('should return api circle', (done) => {
    server
      .get('/circles')
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }

        res.status.should.equal(200);
        done();
      });
  });

  it('should delete a circle', (done) => {
    server
      .delete('/circles/10')
      .expect(200)
      .end((err, res) => {
        if (err) { done(err); return; }

        res.status.should.equal(200);
        done();
      });
  });
});
