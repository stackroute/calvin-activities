/* eslint prefer-arrow-callback:0, func-names:0 */
const app = require('../../app');

const expect = require('chai').expect;
require('chai').should();

const request = require('supertest');

const start=require('../../db');

const circleDAO = require('../../dao').circle;

const mailboxDAO = require('../../dao').mailbox;

const followDAO = require('../../dao').follow;

const uuid = start.uuid;

const authorize = require('../../authorize');

describe('/follow api', function () {
  let circleId;
  let mailboxId;
  let token;
  before(function (done) {
    circleDAO.createCircle((err, result) => {
      circleId = result;
    });
    mailboxDAO.createMailbox((err, result) => {
      mailboxId = result;
    });
    token = authorize.generateJWTToken();
    setTimeout(() => {
      done();
    }, 400);
  });

  it('should add if circle id, mailbox id exist and follower does not exist', function (done) {
    mailboxDAO.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
      doesMailboxExists.should.be.equal(true);
      circleDAO.checkIfCircleExists(circleId, (err1, doesCircleExists) => {
        doesCircleExists.should.be.equal(true);
        followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, doesFollowExistsBefore) => {
          doesFollowExistsBefore.should.be.equal(false);
          request(app)
            .post(`/mailbox/${mailboxId}/circle/${circleId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /json/)
            .end(function (err4, res) {
              if (err4) { done(err4); return; }
              res.body.should.have.property('circleId').equal(circleId).a('string');
              res.body.should.have.property('mailboxId').equal(mailboxId).a('string');
              followDAO.checkIfFollowExists({ circleId, mailboxId }, (err3, doesFollowExistsAfter) => {
                doesFollowExistsAfter.should.be.equal(true);
                done();
              });
            });
        });
      });
    });
  });

  it('should fail to add follow if circle does not exist, but mailbox exists', function (done) {
    const randomCircleId=uuid();
    mailboxDAO.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
      doesMailboxExists.should.be.equal(true);
      circleDAO.checkIfCircleExists(randomCircleId, (err1, doesCircleExists) => {
        doesCircleExists.should.be.equal(false);
        followDAO.checkIfFollowExists({ circleId: randomCircleId, mailboxId }, (err2, doesFollowExistsBefore) => {
          doesFollowExistsBefore.should.be.equal(false);
          request(app)
            .post(`/mailbox/${mailboxId}/circle/${randomCircleId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .expect('Content-Type', /json/)
            .end(function (err3, res) {
              if (err3) { done(err3); return; }
              res.body.should.have.property('message').equal(`Circle with id ${randomCircleId} does not exist`);
              followDAO.checkIfFollowExists({ circleId: randomCircleId, mailboxId }, (err4, doesFollowExistsAfter) => {
                if (err4) { done(err4); return; }
                doesFollowExistsAfter.should.be.equal(false);
                done();
              });
            });
        });
      });
    });
  });

  it('should fail to add follow if mailbox id does not exist, but circle exists', function (done) {
    const randomMailboxId=uuid();
    mailboxDAO.checkIfMailboxExists(randomMailboxId, (err, doesMailboxExists) => {
      doesMailboxExists.should.be.equal(false);
      circleDAO.checkIfCircleExists(circleId, (err1, doesCircleExists) => {
        doesCircleExists.should.be.equal(true);
        followDAO.checkIfFollowExists({ circleId, mailboxId: randomMailboxId }, (err2, doesFollowExistsBefore) => {
          doesFollowExistsBefore.should.be.equal(false);
          request(app)
            .post(`/mailbox/${randomMailboxId}/circle/${circleId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err3, res) {
              if (err3) { done(err3); return; }
              res.body.should.have.property('message').equal(`Mailbox with id ${randomMailboxId} does not exist`);
              followDAO.checkIfFollowExists({ circleId, mailboxId: randomMailboxId }, (err4, doesFollowExistsAfter) => {
                if (err4) { done(err4); return; }
                doesFollowExistsAfter.should.be.equal(false);
                done();
              });
            });
        });
      });
    });
  });

  it('should fail to add follow if circle id and mailbox id do not exist', function (done) {
    const randomCircleId=uuid();
    const randomMailboxId=uuid();
    mailboxDAO.checkIfMailboxExists(randomMailboxId, (err, doesMailboxExists) => {
      doesMailboxExists.should.be.equal(false);
      circleDAO.checkIfCircleExists(randomCircleId, (err1, doesCircleExists) => {
        doesCircleExists.should.be.equal(false);
        followDAO.checkIfFollowExists({ circleId: randomCircleId, mailboxId: randomMailboxId },
          (err2, doesFollowExistsBefore) => {
            doesFollowExistsBefore.should.be.equal(false);
            request(app)
              .post(`/mailbox/${randomMailboxId}/circle/${randomCircleId}`)
              .set('Authorization', `Bearer ${token}`)
              .expect('Content-Type', /json/)
              .expect(404)
              .end(function (err3, res) {
                if (err3) { done(err3); return; }
                res.body.should.have.property('message')
                  .equal(`Mailbox with id ${randomMailboxId} does not exist`);
                followDAO.checkIfFollowExists({ circleId: randomCircleId, mailboxId: randomMailboxId },
                  (err4, doesFollowExistsAfter) => {
                    doesFollowExistsAfter.should.be.equal(false);
                    done();
                  });
              });
          });
      });
    });
  });

  it('should fail to Follow if follower already exists', function (done) {
    mailboxDAO.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
      doesMailboxExists.should.be.equal(true);
      circleDAO.checkIfCircleExists(circleId, (err1, doesCircleExists) => {
        doesCircleExists.should.be.equal(true);
        followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, doesFollowExistsBefore) => {
          doesFollowExistsBefore.should.be.equal(true);
          request(app)
            .post(`/mailbox/${mailboxId}/circle/${circleId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(409)
            .expect('Content-Type', /json/)
            .end(function (err3, res) {
              if (err3) { done(err3); return; }
              res.body.should.have.property('message').equal(`Mailbox ${mailboxId} is already following ${circleId}`);
              followDAO.checkIfFollowExists({ circleId, mailboxId }, (err4, doesFollowExistsAfter) => {
                if (err4) { done(err4); return; }
                doesFollowExistsAfter.should.be.equal(true);
                done();
              });
            });
        });
      });
    });
  });

  it('should delete a follower', function (done) {
    mailboxDAO.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
      doesMailboxExists.should.be.equal(true);
      circleDAO.checkIfCircleExists(circleId, (err1, doesCircleExists) => {
        doesCircleExists.should.be.equal(true);
        followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, doesFollowExistsBefore) => {
          doesFollowExistsBefore.should.be.equal(true);
          request(app)
            .delete(`/mailbox/${mailboxId}/circle/${circleId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err3, res) {
              if (err3) { done(err3); return; }
              res.body.should.have.property('mailboxId').equal(mailboxId).a('string');
              res.body.should.have.property('circleId').equal(circleId).a('string');
              followDAO.checkIfFollowExists({ circleId, mailboxId }, (err4, doesFollowExistsAfter) => {
                if (err4) { done(err4); return; }
                doesFollowExistsAfter.should.be.equal(false);
                done();
              });
            });
        });
      });
    });
  });

  it('should fail to delete follower if follower does not exists', function (done) {
    mailboxDAO.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
      doesMailboxExists.should.be.equal(true);
      circleDAO.checkIfCircleExists(circleId, (err1, doesCircleExists) => {
        doesCircleExists.should.be.equal(true);
        followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, doesFollowExistsBefore) => {
          doesFollowExistsBefore.should.be.equal(false);
          request(app)
            .delete(`/mailbox/${mailboxId}/circle/${circleId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .end(function (err3, res) {
              if (err3) { done(err3); return; }
              followDAO.checkIfFollowExists({ circleId, mailboxId }, (err4, doesFollowExistsAfter) => {
                if (err4) { done(err4); return; }
                doesFollowExistsAfter.should.be.equal(false);
                done();
              });
            });
        });
      });
    });
  });

  it('should fail to delete follower if circle id does not exist, but mailbox exists', function (done) {
    const randomCircleId=uuid();
    mailboxDAO.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
      doesMailboxExists.should.be.equal(true);
      circleDAO.checkIfCircleExists(randomCircleId, (err1, doesCircleExists) => {
        doesCircleExists.should.be.equal(false);
        followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, doesFollowExistsBefore) => {
          doesFollowExistsBefore.should.be.equal(false);
          request(app)
            .delete(`/mailbox/${mailboxId}/circle/${randomCircleId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .expect('Content-Type', /json/)
            .end(function (err3, res) {
              if (err3) { done(err3); return; }
              res.body.should.have.property('message').equal(`Circle with id ${randomCircleId} does not exist`);
              followDAO.checkIfFollowExists({ circleId: randomCircleId, mailboxId }, (err4, doesFollowExistsAfter) => {
                if (err4) { done(err4); return; }
                doesFollowExistsAfter.should.be.equal(false);
                done();
              });
            });
        });
      });
    });
  });

  it('should fail to delete follower if mailbox id does not exist, but circle exists', function (done) {
    const randomMailboxId=uuid();
    mailboxDAO.checkIfMailboxExists(randomMailboxId, (err, doesMailboxExists) => {
      doesMailboxExists.should.be.equal(false);
      circleDAO.checkIfCircleExists(circleId, (err1, doesCircleExists) => {
        doesCircleExists.should.be.equal(true);
        followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, doesFollowExistsBefore) => {
          doesFollowExistsBefore.should.be.equal(false);
          request(app)
            .delete(`/mailbox/${randomMailboxId}/circle/${circleId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .expect('Content-Type', /json/)
            .end(function (err3, res) {
              if (err3) { done(err3); return; }
              res.body.should.have.property('message').equal(`Mailbox with id ${randomMailboxId} does not exist`);
              followDAO.checkIfFollowExists({ circleId, mailboxId: randomMailboxId }, (err4, doesFollowExistsAfter) => {
                if (err4) { done(err4); return; }
                doesFollowExistsAfter.should.be.equal(false);
                done();
              });
            });
        });
      });
    });
  });

  it('should fail to delete follower if circle id and mailbox id do not exist', function (done) {
    const randomCircleId=uuid();
    const randomMailboxId=uuid();
    mailboxDAO.checkIfMailboxExists(randomMailboxId, (err, doesMailboxExists) => {
      doesMailboxExists.should.be.equal(false);
      circleDAO.checkIfCircleExists(randomCircleId, (err1, doesCircleExists) => {
        doesCircleExists.should.be.equal(false);
        followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, doesFollowExistsBefore) => {
          doesFollowExistsBefore.should.be.equal(false);
          request(app)
            .delete(`/mailbox/${randomMailboxId}/circle/${randomCircleId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .expect('Content-Type', /json/)
            .end(function (err3, res) {
              if (err3) { done(err3); return; }
              res.body.should.have.property('message').equal(`Mailbox with id ${randomMailboxId} does not exist`);
              followDAO.checkIfFollowExists({ circleId: randomCircleId, mailboxId: randomMailboxId },
                (err4, doesFollowExistsAfter) => {
                  if (err4) { done(err4); return; }
                  doesFollowExistsAfter.should.be.equal(false);
                  done();
                });
            });
        });
      });
    });
  });
});
