const request = require('supertest');

const server = request.agent('http://localhost:3000');

describe('/mailbox api', () => {
  it('it should create a new mailbox', (done) => {
    server
      .post('/mailbox')
     // .expect(201)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(201);
        done();
      });
  });

  it('should return api mailbox', (done) => {
    // calling home page api
    server
    .get('/mailbox')
    .expect('Content-type', /json/)
    // .expect(200) // THis is HTTP response
    .end((err, res) => {
      if (err) { done(err); return; }
      res.status.should.equal(200);
      done();
    });
  });

  it('should return a particular mailbox', (done) => {
    // calling home page api
    server
    .get('/mailbox/2')
    .expect(200)
    // .expect(200) // THis is HTTP response
    .end((err, res) => {
      if (err) { done(err); return; }
      res.status.should.equal(200);
      done();
    });
  });

  it('should delete a mailbox', (done) => {
    server
    .delete('/mailbox/7')
    .expect(200)
    .end((err, res) => {
      if (err) { done(err); return; }
      res.status.should.equal(200);
      done();
    });
  });
});
