/* eslint prefer-arrow-callback:0, func-names:0, no-loop-func:0*/
const EventEmitter = require('events');

require('chai').should();

const request = require('supertest');

const app = require('../../app');

const start=require('../../db');

const mailboxDao = require('../../dao').mailbox;

const circleDao = require('../../dao').circle;

const followDao = require('../../dao').follow;

const uuid = start.uuid;

const authorize = require('../../authorize');

const bootstrapSocketServer = require('../socket/socketserver');

describe('getOpenMailboxes API', () => {
  const sockets = [];
  const mailboxIds =[];
  let io;
  let token;

  beforeEach((done) => {
    token = authorize.generateJWTToken();
    io = new EventEmitter();
    bootstrapSocketServer(io);

    for (let i=0; i<100; i+=1) {
      const socket = new EventEmitter();
      io.emit('connection', socket);
      sockets.push(socket);
      mailboxDao.createMailbox((error, result) => {
        mailboxIds.push(result.id);
      });
    }

    for (let i=0; i<300; i+=1) {
      const random = Math.ceil(Math.random()*99);
      sockets[random].emit('authorize', `Bearer ${token}`);
      sockets[random].emit('startListeningToMailbox', mailboxIds[Math.ceil(Math.random()*99)]);
    }

    setTimeout(function () {
      done();
    }, 100);
  });

  afterEach((done) => {
    sockets.forEach((socket) => {
      socket.removeAllListeners();
    });
    io.removeAllListeners();
    done();
  });
  it('should return array of Mailbox Ids which are open and number of results should be in the given range',
    function (done) {
      request(app)
        .get('/mailboxesopen/1/3')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err4, res) => {
          (res.body).should.have.property('users').a('object');
          (res.body.users).should.have.property('record_count').a('number').equal(3);
          (res.body.users).should.have.property('total_count').a('number').gt(1);
          (res.body.users).should.have.property('records').a('Array').with.lengthOf(3);
          done();
        });
    });

  it('should return an array of Mailbox Ids when offset is within the range and count is out of range',
    function (done) {
      request(app)
        .get('/mailboxesopen/5/200')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err4, res) => {
          (res.body).should.have.property('users').a('object');
          (res.body.users).should.have.property('record_count').a('number').gt(1);
          (res.body.users).should.have.property('total_count').a('number').gt(1);
          (res.body.users).should.have.property('records').a('Array').with.length.gt(3);
          done();
        });
    });

  it('should fail when the given range is not available', function (done) {
    request(app)
      .get('/getallcircles/110/3')
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err4, res) => {
        (res.body).should.have.property('message').a('string').equal('Not found');
        done();
      });
  });
});

describe('/getAllCircles API', () => {
  before(function (done) {
    for (let i=0; i<10; i += 1) {
      circleDao.createCircle(function (err, data) {
        if (err) { throw err; }
      });
    }
    done();
  });
  it('should return array of circles whose elements are from given range', function (done) {
    request(app)
      .get('/getallcircles/1/3')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err4, res) => {
        (res.body).should.have.property('circles').a('object');
        (res.body.circles).should.have.property('record_count').a('number').equal(3);
        (res.body.circles).should.have.property('total_count').a('number').equal(10);
        (res.body.circles).should.have.property('records').a('Array').with.lengthOf(3);
        done();
      });
  });

  it('should return an array of circle ids when offset is within the range and count is out of range', function (done) {
    request(app)
      .get('/getallcircles/5/20')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err4, res) => {
        (res.body).should.have.property('circles').a('object');
        (res.body.circles).should.have.property('record_count').a('number').equal(5);
        (res.body.circles).should.have.property('total_count').a('number').equal(10);
        (res.body.circles).should.have.property('records').a('Array').with.lengthOf(5);
        done();
      });
  });

  it('should fail when the given range is not available', function (done) {
    request(app)
      .get('/getallcircles/11/3')
      .expect(404)
      .expect('Content-Type', /json/)
      .end((err4, res) => {
        (res.body).should.have.property('message').a('string').equal('Not found');
        done();
      });
  });
});

describe('/getAllFollowersOfACircle API', () => {
  let circleId;
  before(function (done) {
    let mailboxId;
    circleDao.createCircle(function (err1, circle) {
      if (err1) { throw err1; }
      circleId = circle.id;
      for (let i=0; i<10; i += 1) {
        mailboxDao.createMailbox((err2, mailbox) => {
          if (err2) { throw err2; }
          mailboxId = mailbox.id;
          followDao.addFollow({ circleId, mailboxId }, function (err3, follower) {
            if (err3) { throw err3; }
          });
        });
      }
      done();
    });
  });

  it('should return array of mailbox ids following the circle and result should be in the given range',
    function (done) {
      circleDao.checkIfCircleExists(circleId, (err, doesCircleExists) => {
        if (err) { done(err); return; }
        doesCircleExists.should.be.equal(true);
        request(app)
          .get(`/getfollowers/${circleId}/1/3`)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err4, res) => {
            (res.body).should.have.property('followers').a('object');
            (res.body.followers).should.have.property('record_count').a('number').equal(3);
            (res.body.followers).should.have.property('total_count').a('number').equal(10);
            (res.body.followers).should.have.property('records').a('Array').with.lengthOf(3);
            done();
          });
      });
    });

  it('should fail when trying to get followers of a circle that does not exists', function (done) {
    const randomCircleId=uuid();
    circleDao.checkIfCircleExists(randomCircleId, (err, doesCircleExists) => {
      if (err) { done(err); return; }
      doesCircleExists.should.be.equal(false);
      request(app)
        .get(`/getfollowers/${randomCircleId}/1/3`)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err4, res) => {
          res.body.should.have.property('message').equal(`Circle with id ${randomCircleId} does not exist`);
          done();
        });
    });
  });
  it('should fail when the given range not available', function (done) {
    circleDao.checkIfCircleExists(circleId, (err, doesCircleExists) => {
      if (err) { done(err); return; }
      doesCircleExists.should.be.equal(true);
      request(app)
        .get(`/getfollowers/${circleId}/12/3`)
        .expect(404)
        .expect('Content-Type', /json/)
        .end((err4, res) => {
          (res.body).should.have.property('message').a('string').equal('Not found');
          done();
        });
    });
  });
});
