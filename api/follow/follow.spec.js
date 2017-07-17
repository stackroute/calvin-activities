
/* eslint prefer-arrow-callback:0, func-names:0 */
const app = require('../../app');

require('chai').should();

const expect = require('chai').expect;

const request = require('supertest');

const start = require('../../db');

const circleDAO = require('../../dao').circle;

const mailboxDAO = require('../../dao').mailbox;

const followDAO = require('../../dao').follow;

const uuid = start.uuid;

const authorize = require('../../authorize');

describe('/follow api', () => {
  let circleId;
  let mailboxId;
  let token;
  before(function (done) {
    token = authorize.generateJWTToken();
    circleDAO.createCircle((err, result) => {
      circleId = result.circleId;
    });
    mailboxDAO.createMailbox((err, result) => {
      mailboxId = result.mailboxId;   
    token = authorize.generateJWTToken();
    setTimeout(() => {
      done();
    }, 400);
  });
  });

  it('should add if circle id, mailbox id exist and follower does not exist', (done) => {
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
            .end((err4, res) => {
              if (err4) { done(err4); return; }
              res.body.should.have.property('circleId').equal(circleId);
              res.body.should.have.property('mailboxId').equal(mailboxId);
              followDAO.checkIfFollowExists({ circleId, mailboxId }, (err3, doesFollowExistsAfter) => {
                doesFollowExistsAfter.should.be.equal(true);
                done();
              });
            });
        });
      });
    });
  });

  it('should fail to add follow if circle does not exist, but mailbox exists', (done) => {
    const randomCircleId = uuid();
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
            .end((err3, res) => {
              if (err3) { done(err3); return; }
              res.body.should.have.property('message').equal(`Circle with id ${randomCircleId} does not exist`);
              // res.body.should.have.property('message').equal('Link does not exist');
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

  it('should fail to add follow if mailbox id does not exist, but circle exists', (done) => {
    const randomMailboxId = uuid();
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
            .end((err3, res) => {
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

  it('should fail to add follow if circle id and mailbox id do not exist', (done) => {
    const randomCircleId = uuid();
    const randomMailboxId = uuid();
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
              .end((err3, res) => {
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

  it('should fail to Follow if follower already exists', (done) => {
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
            .end((err3, res) => {
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

  it('should delete a follower', (done) => {
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
            .end((err3, res) => {
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

  it('should fail to delete follower if follower does not exists', (done) => {
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
            .end((err3, res) => {
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

  it('should fail to delete follower if circle id does not exist, but mailbox exists', (done) => {
    const randomCircleId = uuid();
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
            .end((err3, res) => {
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

  it('should fail to delete follower if mailbox id does not exist, but circle exists', (done) => {
    const randomMailboxId = uuid();
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
            .end((err3, res) => {
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

  it('should fail to delete follower if circle id and mailbox id do not exist', (done) => {
    const randomCircleId = uuid();
    const randomMailboxId = uuid();
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
            .end((err3, res) => {
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

describe('/follow api with pagination', () => {
  before(function (done) {
    let startedFollowing = new Date();
   token = authorize.generateJWTToken();
    circleDAO.createCircle((err, result) => {
      circleId = result.circleId;
    });
     for ( let i = 0; i <= 10; i++){
      mailboxDAO.createMailbox((err, result) => {  
        mailboxId = result.mailboxId;  
      follower = {circleId, mailboxId}
      followDAO.addFollow(follower, startedFollowing,(err, result) => {
        if (err) { throw err; }
    });
      });
    }
    done();
  });

  it('should return all followers with limit', (done) => {
    request(app)
      .get(`/mailbox/getfollowers/circle/${circleId}?limit=5`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err1, res) => {
        expect(res.body.totalItems).to.be.equal(5);
        for (let i = 0; i < res.body.totalItems; i += 1) {
          expect(res.body.items[i]).to.be.an('object').to.have.property('circleid');
          expect(res.body.items[i]).to.be.an('object').to.have.property('mailboxid');
          expect(res.body.items[i]).to.be.an('object').to.have.property('startedfollowing');
        }
        done();
      });
  });


  it('should return all followers without limit', (done) => {
    request(app)
      .get(`/mailbox/getfollowers/circle/${circleId}?limit=-1`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err1, res) => {
        expect(res.body.totalItems).to.be.above(0);
        for (let i = 0; i < res.body.totalItems; i += 1) {
          expect(res.body.items[i]).to.be.an('object').to.have.property('circleid');
          expect(res.body.items[i]).to.be.an('object').to.have.property('mailboxid');
          expect(res.body.items[i]).to.be.an('object').to.have.property('startedfollowing');
        }
        done();
      });
  });
  });
