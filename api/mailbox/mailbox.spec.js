const app = require('../../app');

const request = require('supertest');

describe('/mailbox api', () => {
  it('it should create a new mailbox', (done) => {
    request(app)
      .post('/mailbox')
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(201);
        done();
      });
  });

  it('should return api mailbox', (done) => {
    request(app)
      .get('/mailbox')
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(200);
        done();
      });
  });

  it('should return a particular mailbox', (done) => {
    request(app)
      .get('/mailbox/0')
      .expect(200)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(200);
        done();
      });
  });

  it('should delete a mailbox', (done) => {
    request(app)
      .delete('/mailbox/0')
      .expect(200)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(200);
        done();
      });
  });
});
