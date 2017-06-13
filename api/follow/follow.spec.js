const chai = require('chai');

const should = chai.should(); // eslint-disable-line no-unused-vars

const app = require('../../app');

const request = require('supertest');

const dao = require('../../dao/follow/index.js');

describe('/follow api', () => {
  const follower = {
    circleId: 1,
    mailboxId: 2,
  };

  it('it should create a new Follower', (done) => {
    request(app)
      .post('/follow/circle/1/mailbox/2')
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
      .post('/follow/circle/1/mailbox/2')
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
      .delete('/follow/circle/1/mailbox/2')
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
      .delete('/follow/circle/1/mailbox/2')
      .send(follower)
      .expect(404)
      .end((err) => {
        if (err) { done(err); return; }
        dao.checkIfFollowExists(follower.circleId, follower.mailboxId).should.be.equal(false);
        done();
      });
  });
});

