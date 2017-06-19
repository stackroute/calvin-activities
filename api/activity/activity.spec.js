const app = require('../../app');

const expect = require('chai').expect;

const request = require('supertest');

const mailboxDao = require('../../dao/mailbox/');

const circleDao = require('../../dao/circle/');

const followDAO = require('../../dao/follow');

const activityDao = require('../../dao/activity');

// CHANGEME: Describe test cases for "publish to circle" and "publish to mailbox"
describe('Publish to circle API', () => {
  // TODO: Pre assertion should be put inside before block
  let id;
  let circleId;
  let followDao;
  let mailboxId;
  let newactivity;

  before(() => {
    circleId = circleDao.createCircle().id;
    mailboxId = mailboxDao.createMailbox().id;
    newactivity = {
      payload: {
        link: 'www.google.com',
        image: 'image.jpg',
      },
    };
  });

  it('should publish message to circle mailbox when we publish activity to circle', (done) => {
    // TODO: Pre-action should always be present
    expect(JSON.stringify(activityDao.checkIfMailboxEmpty())).to.equal(JSON.stringify({}));
    expect(mailboxDao.checkIfMailboxExists(circleId)).to.equal(true);
    expect(circleDao.checkIfCircleExists(circleId)).to.equal(true);
    // expect(activityDao.getAllMessages()).to.have.lengthOf(0);
    // const arr = activityDao.publishToMailbox(circleId, newactivity); // TODO: write a method (getAllMessages) in activity DAO for checking number of messages in mailbox.
    // console.log(`arr${JSON.stringify(arr)}`);
    // console.log(`arrlength${JSON.stringify(arr.length())}`);
    // console.log(`arrpay${JSON.stringify(arr[circleId].payload)}`);
    // expect(arr).to.have.property('payload');
    // expect(arr).not.to.be.empty;
    // expect(activityDao.checkIfMailboxEmpty()).to.equal();
    // TODO: Assert that mailbox has no activities


    request(app)
      .post(`/circle/${circleId}/activity`) // CHANGEME: URI from /publish/circle/:cid/activity --> /circle/:cid/activity
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('payload');
        // const arr = activityDao.publishToMailbox(circleId, newactivity);
        expect(activityDao.checkActivityPublished(circleId)).to.have.lengthOf.above(0);
        // expect(activityDao.checkActivityPublishedToFollowerMailbox(circleId)).to.have.lengthOf.above(0);
        // expect(activityDao.publishToMailbox(circleId, newactivity)).to.have.lengthOf.above(1);
        // expect(res.body).to.have.property('receiver');
        // expect(console.log(activityDao.createPublishActivity(newactivity))
        // const result = activityDao.createPublishActivity(newactivity);
        // (result.payload).should.have.property('link').a('string');
        // expect(result.payload).to.have.property('link').a('string');
        // expect(result.payload).to.not.be.empty;
        // expect(JSON.stringify(arr)).to.have.property('circleId');
        done();
      });
  });
});
