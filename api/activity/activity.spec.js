const app = require('../../app');

const expect = require('chai').expect;

const request = require('supertest');

const mailboxDao = require('../../dao').mailbox;

const circleDao = require('../../dao').circle;

const followDAO = require('../../dao').follow;

const activityDao = require('../../dao').activity;

// CHANGEME: Describe test cases for "publish to circle" and "publish to mailbox"
describe('/activity API', () => {
  // TODO: Pre assertion should be put inside before block
  let circleId;
  let mailboxId;

  before((done) => {
    circleDao.createCircle((err, result) => {
      circleId = result;
      mailboxDao.createMailbox((error, result1) => {
        mailboxId = result1;
        followDAO.addFollow({ circleId, mailboxId }, (error1, result2) => {
          done();
        });
      });
    });
  });

  it('should publish message to circle mailbox and its followers mailbox when we publish activity to circle', (done) => {
    mailboxDao.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
      doesMailboxExists.should.be.equal(true);
    });
    circleDao.checkIfCircleExists(circleId, (err, doesCircleExists) => {
      doesCircleExists.should.be.equal(true);
    });
    request(app)
      .post(`/circle/${circleId}/activity`)
      .send({ link: 'www.google.com' })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('payload');
        activityDao.checkActivityPublished(circleId, (error, circleActivity) => {
          if (error) { done(error); return; }
          expect(circleActivity).to.have.lengthOf(1);
          expect(circleActivity[0].payload.link).to.equal('www.google.com');
          activityDao.checkActivityPublished(mailboxId, (error1, mailboxActivity) => {
            if (error1) { done(error1); return; }
            expect(mailboxActivity).to.have.lengthOf(1);
            expect(mailboxActivity[0].payload.link).to.equal('www.google.com');
            done();
          });
        });
      });
  });

  it('should publish message to mailbox when we publish activity to mailbox', (done) => {
    mailboxDao.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
      doesMailboxExists.should.be.equal(true);
    });
    request(app)
      .post(`/mailbox/${mailboxId}/activitytomailbox`)
      .send({ link: 'www.facebook.com' })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('payload');
        activityDao.checkActivityPublished(mailboxId, (error, mailboxActivity) => {
          if (error) { done(error); return; }
          expect(mailboxActivity).to.have.lengthOf(2);
          expect(mailboxActivity[0].payload.link).to.equal('www.facebook.com');
          done();
        });
      });
  });


  it('should retrieve message from Mailbox', (done) => {
    request(app)
      .get(`/circle/${circleId}/activity`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.lengthOf(1);
        expect(JSON.stringify(res.body[0].payload.link)).to.equal('"www.google.com"');
        done();
      });
  });

  it('should not retrieve message if mailbox is not-exists', (done) => {
    const mailboxIdd = 'xx3456';
    request(app)
      .get(`/mailbox/${mailboxIdd}/activity`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.be.an('array').to.have.lengthOf(0);
        done();
      });
  });
});
