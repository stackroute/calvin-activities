const app = require('../../app');

const expect = require('chai').expect;
require('chai').should();

const request = require('supertest');

const dao = require('../../dao/circle');

describe('/circle api', () => {
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
        dao.checkIfCircleExists(circleId).should.be.equal(true);
        done();
      });
  });

  it('should delete a circle', (done) => {
    request(app)
      .delete(`/circle/${circleId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        dao.checkIfCircleExists(circleId).should.be.equal(false);
        expect(res.body.id).to.equal(circleId);
        done();
      });
  });

  it('should fail when we try to delete a circle id that does not exist', (done) => {
    request(app)
      .delete(`/circle/${circleId}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        dao.checkIfCircleExists(circleId).should.be.equal(false);
        expect(res.body).to.have.property('message').equal(`Circle id ${circleId} does not exist`);
        done();
      });
  });
});

describe('/follow api', () => {
  const follower = {
    circleId: 1,
    mailboxId: 2,
  };

  it('it should create a new Follower', (done) => {
    request(app)
      .post('/circle//1/mailbox/2')
      .send(follower)
      .expect(201)
      .end((err, res) => {
        if (err) { done(err); return; }
        dao.checkIfFollowExists(follower.circleId, follower.mailboxId).should.be.equal(false);
        done();
      });
  });
  it('it should not add if follower already exists', (done) => {
    request(app)
      .post('/circle//1/mailbox/2')
      .send(follower)
      .expect(405)
      .end((err, res) => {
        if (err) { done(err); return; }
        dao.checkIfFollowExists(follower.circleId, follower.mailboxId).should.be.equal(false);
        done();
      });
  });

  it('it should delete a follower', (done) => {
    request(app)
      .delete('/circle//1/mailbox/2')
      .send(follower)
      .expect(200)
      .end((err) => {
        if (err) { done(err); return; }
        dao.checkIfFollowExists(follower.circleId, follower.mailboxId).should.be.equal(false);
        done();
      });
  });

  it('it should not delete if follower does not exists', (done) => {
    request(app)
      .delete('/circle//1/mailbox/2')
      .send(follower)
      .expect(404)
      .end((err) => {
        if (err) { done(err); return; }
        dao.checkIfFollowExists(follower.circleId, follower.mailboxId).should.be.equal(false);
        done();
      });
  });
});
