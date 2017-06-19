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

<<<<<<< HEAD
  it('should delete a mailbox', (done) => {
    mailboxDao.checkIfMailboxExists(id).should.be.equal(true);
    request(app)
      .delete(`/mailbox/${id}`)
=======
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
>>>>>>> cac4f6992843e63888811259bfec2b3935580a9c
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
<<<<<<< HEAD
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
=======
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

>>>>>>> cac4f6992843e63888811259bfec2b3935580a9c
