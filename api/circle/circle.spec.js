require('chai').should();

const app = require('../../app');

const expect = require('chai').expect;
require('chai').should();

const request = require('supertest');


// FIXME: remane followDAO to followDAO
const circleDAO = require('../../dao/circle');
const followDAO = require('../../dao/follow/');
const mailboxDAO= require('../../dao/mailbox/');

let cid; // FIXME: Use smallest scope possible
let mid; // FIXME: Use smallest scope possible
describe('/circle api', () => {
  let circleId;
  it('it should create a new circle', (done) => {
    request(app)
      .post('/circle/')
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.be.a('string');
        circleId = res.body.id;
        circleDAO.checkIfCircleExists(circleId).should.be.equal(true);
        done();
      });
  });

  it('should delete a circle', (done) => {
    request(app)
      .delete(`/circle/${circleId}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        circleDAO.checkIfCircleExists(circleId).should.be.equal(false);
        expect(res.body.id).to.equal(circleId);
        done();
      });
  });

  it('should fail when we try to delete a circle id that does not exist', (done) => {
    request(app)
      .delete(`/circle/${circleId}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        circleDAO.checkIfCircleExists(circleId).should.be.equal(false);
        expect(res.body).to.have.property('message').equal(`Circle id ${circleId} does not exist`);
        done();
      });
  });
});

before((done) => {
  cid=circleDAO.createCircle().id;
  mid=mailboxDAO.createMailbox().id;
  done();
});

describe('/follow api', () => {
  it('should add if circle id, mailbox id is valid and follower does not exist', (done) => { // FIXME: Avoid using &. Use 'and' instead
    request(app)
      .post(`/circle/${cid}/mailbox/${mid}`) // FIXME: Remove spaces from URI
      .expect(201)
      .expect('Content-Type', /json/) // FIXME: Should be Content-Type
      .end((err, res) => {
        if (err) { done(err); return; }
        // TODO: res.body.circleID should be of type String, and be equal to cid
        // TODO: res.body.mailboxId should be of type String, and be equal to mid
        // res.body.should.have.property('circleId').equal(cid);
        res.body.should.have.property('mailboxId').equal(mid);
        followDAO.checkIfFollowExists(cid, mid).should.be.equal(false); // FIXME: Should be true, not false.
        done();
      });
  });

  it('should fail when we follow a circle that does not exist', (done) => {
    const randomCId=Math.floor(Math.random()*65678664467);
    request(app)
      .post(`/circle/${randomCId}/mailbox/${mid}`) // FIXME: Remove spaces
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Circle with id ${randomCId} does not exist`);
        circleDAO.checkIfCircleExists(randomCId).should.be.equal(false);
        followDAO.checkIfFollowExists(randomCId, mid).should.be.equal(false);
        // FIXME: What is this test for? checkIfCircleExists only takes 1 argument. Remove check
        // TODO: Use follow DAO to assert that the follow between randomCId and mid doesnt exist
        done();
      });
  });

  it('should not add if mailbox id does not exist', (done) => { // FIXME: replace "not add" with "fail"
    const randomMId=Math.floor(Math.random()*65678664467);
    request(app)
      .post(`/circle/${cid}/mailbox/${randomMId}`) // FIXME: Remove quote from URI
      .expect('Content-Type', /json/) // TODO: Check for Content-Type
      .expect(404)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Mailbox with id ${randomMId} does not exist`);
        followDAO.checkIfFollowExists(cid, randomMId).should.be.equal(false); // FIXME: Should assert that follow between cid and randomMId does not exist.
        done();
      });
  });

  it('should fail if circle id & mailbox id both do not exist', (done) => { // FIXME: replace "not add" with "fail"
    const randomCId=Math.floor(Math.random()*65678664467);
    const randomMId=Math.floor(Math.random()*65678664467);
    request(app)
      .post(`/circle/${randomCId}/mailbox/${randomMId}`) // FIXME: Remove spaces from URI
      .expect('Content-Type', /json/) // TODO: Check for Content-Type
      .expect(404)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Circle with id ${randomCId} does not exist`);
        followDAO.checkIfFollowExists(randomCId, randomMId).should.be.equal(false); // FIXME: Should assert that follow between randomCId and mid does not exist.
        done();
      });
  });

  it('should fail if follower exists', (done) => {
    request(app)
      .post(`/circle/${cid}/mailbox/${mid}`) // FIXME: Remove spaces from URI
      .expect(409) // FIXME: Failure scenario. Should not return success code
      .expect('Content-Type', /json/) // TODO: Check for Content-Type
      .end((err, res) => {
        if (err) { done(err); return; }
        followDAO.checkIfFollowExists(cid, mid).should.be.equal(true); // FIXME: should test with true, not false
        done();
      });
  });

  it('should delete a follower', (done) => {
    request(app)
      .delete(`/circle/${cid}/mailbox/${mid}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('mailboxId');
        res.body.should.have.property('circleId');
        followDAO.checkIfFollowExists(cid, mid).should.be.equal(false);
        done();
      });
  });

  it('should fail if circle id does not exist', (done) => {
    const randomCId=Math.floor(Math.random()*65678664467);
    request(app)
      .delete(`/circle/${randomCId}/mailbox/${mid}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Circle with id ${randomCId} does not exist`);
        circleDAO.checkIfCircleExists(randomCId).should.be.equal(false);
        done();
      });
  });

  it('should fail if mailbox id does not exist', (done) => {
    const randomMId=Math.floor(Math.random()*65678664467);
    request(app)
      .delete(`/circle/${cid}/mailbox/${randomMId}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Mailbox with id ${randomMId} does not exist`);
        mailboxDAO.checkIfMailboxExists(randomMId).should.be.equal(false);
        done();
      });
  });

  it('should fail if circle id and mailbox id does not exist', (done) => {
    const randomCId=Math.floor(Math.random()*65678664467);
    const randomMId=Math.floor(Math.random()*65678664467);
    request(app)
      .delete(`/circle/${randomCId}/mailbox/ ${randomMId}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Circle with id ${randomCId} does not exist`);
        followDAO.checkIfFollowExists(randomCId, randomMId).should.be.equal(false);
        done();
      });
  });

  it('should fail if follower does not exists', (done) => {
    const randomCId=Math.floor(Math.random()*65678664467);
    request(app)
      .delete(`/circle/${randomCId}/mailbox/${mid}`)
      .expect(404)
      .end((err, res) => {
        if (err) { done(err); return; }
        followDAO.checkIfFollowExists(cid, mid).should.be.equal(false);
        done();
      });
  });
});
