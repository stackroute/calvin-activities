const app = require('../../app');

const expect = require('chai').expect;

require('chai').should();

const request = require('supertest');

const mailboxDao = require('../../dao/mailbox/');

describe('/mailbox api', () => {
  let mailboxId;
  it('should create a new mailbox', (done) => {
    request(app)
      .post('/mailbox')
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.be.a('string');
        mailboxId = res.body.id;
        mailboxDao.checkIfMailboxExists(mailboxId, (error, mailboxExists) => {
          if (err) { done(err); return; }
          mailboxExists.should.be.equal(true);
          done();
        });
      });
  });


  it('should delete a mailbox', (done) => {
    request(app)
      .delete(`/mailbox/${mailboxId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('id');
        mailboxDao.checkIfMailboxExists(mailboxId, (error, mailboxExists) => {
          mailboxExists.should.be.equal(false);
          done();
        });
      });
  });


  it('should return an error when we try to delete a mailbox that does not exist', (done) => {
    request(app)
      .delete(`/mailbox/${mailboxId}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); } else {
          mailboxDao.checkIfMailboxExists(mailboxId, (error, mailboxExists) => {
            if (error) { done(error); return; }
            mailboxExists.should.be.equal(false);
            done();
          });
        }
      });
  });
});
