const app = require('../../app');

const request = require('supertest');

describe('/circle api', () => {
  it('it should create a new circle', (done) => {
    request(app)
      .post('/circles')
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(201);
        done();
      });
  });

  it('should return api circle', (done) => {
    request(app)
      .get('/circles')
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }

        res.status.should.equal(200);
        done();
      });
  });

  it('should delete a circle', (done) => {
    request(app)
      .delete('/circles/1')
      .expect(200)
      .end((err, res) => {
        if (err) { done(err); return; }

        res.status.should.equal(200);
        done();
      });
  });
});
