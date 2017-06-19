const app = require('../../app');

const expect = require('chai').expect;

const request = require('supertest');

const mailboxDao = require('../../dao/mailbox/');

const circleDao = require('../../dao/circle/');

const followDAO = require('../../dao/follow');

const activityDao = require('../../dao/activity');

// CHANGEME: Describe test cases for "publish to circle" and "publish to mailbox"
describe('/activity API', () => {
  // TODO: Pre assertion should be put inside before block
  let id;
  let circleId;
  let mailboxId;
  let newactivity;

  before(() => {
    circleId = circleDao.createCircle().id;
    mailboxId = mailboxDao.createMailbox().id;
    followDAO.addFollow({ circleId, mailboxId });
    expect(JSON.stringify(activityDao.checkIfMailboxEmpty(circleId))).to.equal(JSON.stringify({}));
    expect(JSON.stringify(activityDao.checkIfMailboxEmpty(mailboxId))).to.equal(JSON.stringify({}));
  });

  it('should publish message to circle mailbox and its followers mailbox when we publish activity to circle', (done) => {
    // TODO: Pre-action should always be present
    request(app)
      .post(`/circle/${circleId}/activity`)
      .send({ link: 'www.google.com' })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('payload');
        const circleActivity = activityDao.checkActivityPublished(circleId);
        expect(circleActivity).to.have.lengthOf(1);
        expect(circleActivity[0].payload.link).to.equal('www.google.com');

        const mailboxActivity = activityDao.checkActivityPublished(mailboxId);
        expect(mailboxActivity).to.have.lengthOf(1);
        expect(mailboxActivity[0].payload.link).to.equal('www.google.com');

        done();
      });
  });
});
