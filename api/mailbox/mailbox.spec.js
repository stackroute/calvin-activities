/* eslint prefer-arrow-callback:0, func-names:0 */
const app = require('../../app');

const expect = require('chai').expect;

require('chai').should();

const request = require('supertest');

const mailboxDao = require('../../dao').mailbox;

const authorize = require('../../authorize');

describe('/mailbox api', () => {
  let mailboxId;
  let token;
  before(function (done) {
    token = authorize.generateJWTToken();
    done();
  });
  it('should create a new mailbox', (done) => {
    request(app)
      .post('/mailbox')
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('id').a('string');
        mailboxId = res.body.id;
        mailboxDao.checkIfMailboxExists(mailboxId, (error, mailboxExists) => {
          if (err) { done(err); return; }
          mailboxExists.should.be.equal(true);
          done();
        });
      });
  });


  it('should delete a mailbox', (done) => {
    mailboxDao.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
      doesMailboxExists.should.be.equal(true);
      request(app)
        .delete(`/mailbox/${mailboxId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err1, res) => {
          if (err1) { done(err1); return; }
          expect(res.body.id).to.equal(mailboxId);
          mailboxDao.checkIfMailboxExists(mailboxId, (error, mailboxExists) => {
            mailboxExists.should.be.equal(false);
            done();
          });
        });
    });
  });


  it('should return an error when we try to delete a mailbox that does not exist', (done) => {
    mailboxDao.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
      if (err) { done(err); return; }
      doesMailboxExists.should.be.equal(false);
      request(app)
        .delete(`/mailbox/${mailboxId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err1, res) => {
          if (err1) { done(err1); } else {
            mailboxDao.checkIfMailboxExists(mailboxId, (error, mailboxExists) => {
              if (error) { done(error); return; }
              mailboxExists.should.be.equal(false);
              done();
            });
          }
        });
    });
  });
});

