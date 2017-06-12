const chai = require('chai');

const should = chai.should();

const app = require('../../app');

const request = require('supertest');

const server = request.agent('http://localhost:3000');


describe('/follow api', () => {
  const follower = {
    cid: 1,
    mid: 2,
  };

  it('it should create a new Follower', (done) => {
    request(app)
      .post('/follow')
      .send(follower)
      .expect(201)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.cid.should.be.equal(follower.cid);
        res.body.mid.should.be.equal(follower.mid);
        done();
      });
  });

  it('it should retrieve list of followers', (done) => {
    request(app)
      .get('/follow')
      .expect('Content-type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(200);
        done();
      });
  });
  it('it should retrieve circle id by mailbox id', (done) => {
    request(app)
      .get('/follow/cid/02')
      .end((err, res) => {
        if (err) { done(err); return; }
        should.exist(res.body);
        done();
      });
  });

  it('it should retrieve mailbox id using circle id', (done) => {
    request(app)
      .get('/follow/mid/01')
      .end((err, res) => {
        if (err) { done(err); return; }
        should.exist(res.body);
        done();
      });
  });

  it('it should delete a follower', (done) => {
    request(app)
      .delete('/follow/circles/01/mailboxes/02')
      .send(follower)
      .expect(404)
      .end((err) => {
        if (err) { done(err); return; }
        done();
      });
  });
});
