const request = require('supertest');

const server = request.agent('http://localhost:3000');

describe('/mailbox api', () => {
  it('it should create a new mailbox', (done) => {
    server
      .post('/mailbox')
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(201);
        done();
      });
  });

  it('should return api mailbox', (done) => {
    server
      .get('/mailbox')
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(200);
        done();
      });
  });

  it('should return a particular mailbox', (done) => {
    server
      .get('/mailbox/0')
      .expect(200)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(200);
        done();
      });
  });

  it('should delete a mailbox', (done) => {
    server
      .delete('/mailbox/0')
      .expect(200)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(200);
        done();
      });
  });
});
