const app = require('../../app');

const expect = require('chai').expect;

const request = require('supertest');

const mailboxDao = require('../../dao').mailbox;

const circleDao = require('../../dao').circle;

const followDAO = require('../../dao').follow;

const activityDao = require('../../dao').activity;

const authorize = require('../../authorize');

describe('/activity API', () => {
  let circleId;
  let mailboxId;
  let token;
  const startedFollowing = new Date();
  before((done) => {
    token = authorize.generateJWTToken();
    circleDao.createCircle((err, result) => {
      if (err) { throw err; }
      circleId = result.circleId;
      mailboxDao.createMailbox((error, result1) => {
        if (error) { throw error; }
        mailboxId = result1.mailboxId;
        followDAO.addFollow({ circleId, mailboxId }, startedFollowing, (error1, result2) => {
          setTimeout(() => {
            done();
          }, 1500);
        });
      });
    });
  });
  afterEach((done) => {
    circleDao.deleteCircle(circleId, (err, result) => {
      if (err) { throw err; }
    });
    done();
  });

  it('should publish message to mailbox when we publish activity to mailbox', (done) => {
    mailboxDao.checkIfMailboxExists(mailboxId, (err1, doesMailboxExists) => {
      request(app)
        .post(`/mailbox/${mailboxId}/activitytomailbox`)
        .set('Authorization', `Bearer ${token}`)
        .send({ link: 'www.facebook.com' })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) { done(err); return; }
          expect(res.body).to.have.property('payload');
          activityDao.checkActivityPublished(mailboxId, (error, mailboxActivity) => {
            if (error) { done(error); return; }
            expect(mailboxActivity).to.have.lengthOf(1);
            const b = (mailboxActivity[0].payload);
            const c = JSON.parse(b);
            const result = c.payload.link;
            expect(result).to.equal('www.facebook.com');
            done();
          });
        });
    });
  });


  it('should retrieve activities from Mailbox', (done) => {
    mailboxDao.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
      if (err) { done(err); return; }
      expect(doesMailboxExists).be.equal(true);
      request(app)
        .get(`/circle/getallactivities/${mailboxId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err1, res) => {
          if (err1) { done(err1); return; }
            expect(res.body.items[0].payload).to.contain('www.facebook.com');
          done();
        });
    });
  });

  it('should not retrieve message if mailbox is not-exists', (done) => {
    const mailboxIdd = 'xx3456';
    request(app)
      .get(`/mailbox/${mailboxIdd}/activity`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.be.an('object').that.is.empty;
        done();
      });
  });
});



