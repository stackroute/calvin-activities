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

  before((done) => {
    circleId = circleDao.createCircle().id;
    mailboxId = mailboxDao.createMailbox().id;
    followDAO.addFollow({ circleId, mailboxId });
    expect(JSON.stringify(activityDao.checkIfMailboxEmpty(circleId))).to.equal(JSON.stringify({}));
    expect(JSON.stringify(activityDao.checkIfMailboxEmpty(mailboxId))).to.equal(JSON.stringify({}));
    done();
  });

  it('should publish message to circle mailbox and its followers mailbox when we publish activity to circle', (done) => {
    // TODO: Pre-action should always be present
    expect(JSON.stringify(activityDao.checkIfMailboxEmpty())).to.equal(JSON.stringify({}));
    expect(mailboxDao.checkIfMailboxExists(circleId)).to.equal(true);
    expect(circleDao.checkIfCircleExists(circleId)).to.equal(true);
    request(app)
      .post(`/circle/${circleId}/activity`)
      .send({ link: 'www.google.com' })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('payload');
        const circleActivity = activityDao.checkActivityPublished(circleId, (error, activityPublished) => {
          if (error) { done(error); return; }
          activityPublished.should.be.equal(true);
          done();
        });
        expect(circleActivity).to.have.lengthOf(1);
        expect(circleActivity[0].payload.link).to.equal('www.google.com');

        const mailboxActivity = activityDao.checkActivityPublished(mailboxId, (error, activityPublished) => {
          if (error) { done(error); return; }
          activityPublished.should.be.equal(true);
          done();
        });
        expect(mailboxActivity).to.have.lengthOf(1);
        expect(mailboxActivity[0].payload.link).to.equal('www.google.com');

        done();
      });
  });
});

describe('Retrive message from mailbox', () => {
  let id;
  let circleId;
  let mailboxId;
  let newactivity;

  before(() => {
    circleId = circleDao.createCircle().id;
    mailboxId = mailboxDao.createMailbox().id;

    // console.log('Inside activity', circleId, mailboxId);
    newactivity = {
      payload: {
        link: 'www.google.com',
        image: 'image.jpg',
      },
    };
    activityDao.publishToMailbox(mailboxId, newactivity, (err, activityPublished) => {
      if (err) { done(err); return; }
      activityPublished.should.be.equal(true);
      done();
    });
  });
  // after(() => {

  //   console.log(`res.bodymailboxId aftereach${mailboxId}`);
  // });


  it('should retrieve message from Mailbox', (done) => {
    console.log(`res.bodymailboxId${mailboxId}`);
    request(app)
      .get(`/circle/${mailboxId}/activity`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        // console.log(`res.body${JSON.stringify(res.body[0].payload.link)}`);
        expect(res.body).to.have.lengthOf(1);
        // console.log(`\${mailboxId} inside test case${mailboxId}`);
        // console.log(`\${mailboxId} inside test case res.body${res.body}`);
        expect(JSON.stringify(res.body[0].payload.link)).to.equal('"www.google.com"');
        expect(JSON.stringify(res.body[0].payload.image)).to.equal('"image.jpg"');

        done();
      });
  });

  // it('should not retreive message if mailbox is not-exists')
  it('should not retrieve message if mailbox is not-exists', (done) => {
    console.log(`res.bodymailboxId not exist${mailboxId}`);
    const mailboxIdd = 'xx3456';
    request(app)
      .get(`/circle/${mailboxIdd}/activity`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        console.log(`res.bodymailboxId${JSON.stringify(res.body)}`);
        // expect(res.body).to.have.property('message').equal(`Mailbox with id ${mailboxIdd} does not exist`);
        expect(res.body).to.be.an('array').to.have.lengthOf(0);
        // console.log(`\${mailboxId} inside test case${mailboxId}`);
        // console.log(`\${mailboxId} inside test case res.body${res.body}`);
        done();
      });
  });
});
