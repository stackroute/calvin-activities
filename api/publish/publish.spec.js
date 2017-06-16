const app = require('../../app');

const expect = require('chai').expect;

const request = require('supertest');

const mailboxDao = require('../../dao/mailbox/');

const circleDao = require('../../dao/circle/');

const followDAO = require('../../dao/follow');

const publishDao = require('../../dao/publish');

// CHANGEME: Describe test cases for "publish to circle" and "publish to mailbox"
describe('/publish api', () => {
  // TODO: Pre assertion should be put inside before block
  const circleId = circleDao.createCircle().id;
  const mailboxId=mailboxDao.createMailbox().id;

  let id;
  it('should publish an activity to a circle and its mailboxid', (done) => {
    // TODO: Pre-action should always be present
    request(app)
      .post(`/publish/circle/${circleId}/activity`) // CHANGEME: URI from /publish/circle/:cid/activity --> /circle/:cid/activity
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('payload');
        expect(mailboxDao.checkIfMailboxExists(circleId)).to.equal(true);
        expect(circleDao.checkIfCircleExists(circleId)).to.equal(true);
        // expect(followDAO.checkIfFollowExists({ circleId, mailboxId }).to.equal(true));
        // expect(26).to.equal(26);
        // console.log(`publish${circleId}`);
        expect(publishDao.checkIfActivityPublished(circleId)).to.equal(true);
        done();
      });
  });

  it('should publish an activity to mailboxid', (done) => {
    request(app)
      .post(`/publish/mailbox/${mailboxId}/activity`)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('payload');
        done();
      });
  });
});
