const app = require('../../app');

require('chai').should();

const request = require('supertest');

const mailboxDao = require('../../dao/mailbox/');

describe('/mailbox api', () => {
  let id;
  it('should create a new mailbox', (done) => {
    request(app)
      .post('/mailbox')
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('id').equal(res.body.id).a('string');
        id = res.body.id;
        mailboxDao.checkIfMailboxExists(id).should.be.equal(true);
        done();
      });
  });

  it('should delete a mailbox', (done) => {
    mailboxDao.checkIfMailboxExists(id).should.be.equal(true);
    request(app)
      .delete(`/mailbox/${id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('id').equal(res.body.id).a('string');
        mailboxDao.checkIfMailboxExists(id).should.be.equal(false);
        done();
      });
  });

  it('should return an error when we try to delete a mailbox that does not exist', (done) => {
    mailboxDao.checkIfMailboxExists(id).should.be.equal(false);
    request(app)
      .delete(`/mailbox/${id}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Mailbox with id ${id} does not exist`);
        mailboxDao.checkIfMailboxExists(id).should.be.equal(false);
        done();
      });
  });
});
