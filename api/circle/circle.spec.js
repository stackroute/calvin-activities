require('chai').should();

const app = require('../../app');

const request = require('supertest');

// FIXME: remane followDAO to followDAO
const followDAO = require('../../dao/follow/'); // FIXME: Dont use index. It is implicit. use require('../../dao/follow')

let cid; // FIXME: Use smallest scope possible
let mid; // FIXME: Use smallest scope possible
describe('/circle api', () => {
  it('it should create a new circle', (done) => {
    request(app)
      .post('/circle')
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(201);
        done();
      });
  });

  it('should return api circle', (done) => {
    request(app)
      .get('/circle')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(200);
        done();
      });
  });

  it('should delete a circle', (done) => {
    request(app)
      .delete('/circle/1')
      .expect(200)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.status.should.equal(200);
        done();
      });
  });
});

before((done) => {
  cid=followDAO.createCircle().id;
  mid=followDAO.createMailbox().id;
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
        followDAO.checkIfCircleExists(randomCId).should.be.equal(false); // FIXME: What is this test for? checkIfCircleExists only takes 1 argument. Remove check
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

  it('should not add if circle id & mailbox id both do not exist', (done) => { // FIXME: replace "not add" with "fail"
    const randomCId=Math.floor(Math.random()*65678664467);
    request(app)
      .post(`/circle/${randomCId}/mailbox/${mid}`) // FIXME: Remove spaces from URI
      .expect('Content-Type', /json/) // TODO: Check for Content-Type
      .expect(404)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.body.should.have.property('message').equal(`Circle with id ${randomCId} does not exist`);
        followDAO.checkIfFollowExists(randomCId, mid).should.be.equal(false); // FIXME: Should assert that follow between randomCId and mid does not exist.
        done();
      });
  });

  it('should not add if follower exists', (done) => {
    console.log(followDAO.checkIfFollowExists(cid, mid));
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

  // it('it should delete a follower', (done) => {
  //   request(app)
  //     .delete(`/circle/ ${cid}'/mailbox/ ${mid}`)
  //     .expect(200)
  //     .end((err) => {
  //       if (err) { done(err); return; }
  //       followDAO.checkIfFollowExists(cid, mid).should.be.equal(false);
  //       done();
  //     });
  // });

  // it('it should fail if circle id does not exist', (done) => {
  //   request(app)
  //     .delete(`/circle/ ${cid}'/mailbox/ ${mid}`)
  //     .expect(200)
  //     .end((err) => {
  //       if (err) { done(err); return; }
  //       followDAO.checkIfFollowExists(cid, mid).should.be.equal(false);
  //       done();
  //     });
  // });

  // it('it should fail if mailbox id does not exist', (done) => {
  //   request(app)
  //     .delete(`/circle/ ${cid}'/mailbox/ ${mid}`)
  //     .expect(200)
  //     .end((err) => {
  //       if (err) { done(err); return; }
  //       followDAO.checkIfFollowExists(cid, mid).should.be.equal(false);
  //       done();
  //     });
  // });

  // it('it should fail if circle id and mailbox id does not exist', (done) => {
  //   request(app)
  //     .delete(`/circle/ ${cid}'/mailbox/ ${mid}`)
  //     .expect(200)
  //     .end((err) => {
  //       if (err) { done(err); return; }
  //       followDAO.checkIfFollowExists(cid, mid).should.be.equal(false);
  //       done();
  //     });
  // });

  // it('it should fail if follower does not exists', (done) => {
  //   request(app)
  //     .delete(`/circle/ ${cid}'/mailbox/ ${mid}`)
  //     .expect(200)
  //     .end((err, res) => {
  //       if (err) { done(err); return; }
  //       followDAO.checkIfFollowExists(cid, mid).should.be.equal(false);
  //       done();
  //     });
  // });
});
