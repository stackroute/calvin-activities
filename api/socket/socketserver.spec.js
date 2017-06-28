const EventEmitter = require('events');
const authorize = require('../../authorize');
const mailboxDao = require('../../dao').mailbox;
const circleDao = require('../../dao').circle;
const followDao = require('../../dao').follow;
const activityDao = require('../../dao').activity;
const expect = require('chai').expect;
const bootstrapSocketServer = require('./socketserver');
require('chai').should();

describe('/push notifications', () => {
  let token;
  let socket;
  let io;
  let circleId;
  let mailboxId;
  let validEventEmitted;
  const payload = {};
  payload.name = 'Tester';
  beforeEach((done) => {
    validEventEmitted = false;
    token = authorize.generateJWTToken();
    io = new EventEmitter();
    socket = new EventEmitter();
    bootstrapSocketServer(io);
    io.emit('connection', socket);

    circleDao.createCircle((err, result) => {
      circleId = result;
      mailboxDao.createMailbox((error, result1) => {
        mailboxId = result1;
        followDao.addFollow({ circleId, mailboxId }, (error1, result2) => {
          done();
        });
      });
    });
  });

  afterEach((done) => {
    socket.removeAllListeners();
    io.removeAllListeners();
    done();
  });

  it('should receive activity when published to a mailbox directly', (done) => {
    socket.emit('authorize', `Bearer ${token}`);
    socket.emit('startListeningToMailbox', mailboxId);
    socket.once('newActivity', (activity) => {
      if (activity && activity.name === 'Tester') validEventEmitted = true;
    });
    activityDao.publishToMailbox(mailboxId, payload, (err, result) => {
      setTimeout(() => { validEventEmitted.should.be.equal(true); done(); }, 1500);
    });
  });

  it('should receive activity when published to a circle which mailbox follows', (done) => {
    socket.emit('authorize', `Bearer ${token}`);
    socket.emit('startListeningToMailbox', mailboxId);
    socket.once('newActivity', (activity) => {
      if (activity && activity.name === 'Tester') validEventEmitted = true;
    });
    activityDao.createPublishActivity(circleId, payload, (err, result) => {
      setTimeout(() => { validEventEmitted.should.be.equal(true); done(); }, 1500);
    });
  });

  it('should not receive activity when published to circle which mailbox stopped following', (done) => {
    socket.emit('authorize', `Bearer ${token}`);
    socket.emit('startListeningToMailbox', mailboxId);
    socket.once('newActivity', (activity) => {
      if (activity && activity.name === 'Tester') validEventEmitted = true;
    });
    followDao.deleteFollow({ circleId, mailboxId }, (err, res) => {
      activityDao.createPublishActivity(circleId, payload, (error, result) => {
        setTimeout(() => { validEventEmitted.should.be.equal(false); done(); }, 1500);
      });
    });
  });

  it('should not receive activity when listening to invalid mailbox', (done) => {
    socket.emit('authorize', `Bearer ${token}`);
    socket.emit('startListeningToMailbox', '123');
    socket.once('newActivity', (activity) => {
      if (activity && activity.name === 'Tester') validEventEmitted = true;
    });
    activityDao.createPublishActivity(circleId, payload, (err, result) => {
      setTimeout(() => { validEventEmitted.should.be.equal(false); done(); }, 1500);
    });
  });

  it('should not receive activity in case same mailBoxId on a new connection is not authorized', (done) => {
    socket.emit('startListeningToMailbox', mailboxId);
    socket.once('newActivity', (activity) => {
      if (activity && activity.name === 'Tester') validEventEmitted = true;
    });
    activityDao.createPublishActivity(mailboxId, payload, (err, result) => {
      setTimeout(() => { validEventEmitted.should.be.equal(false); done(); }, 1500);
    });
  });

  it('should receive activity in case same mailBoxId on a new connection is authorized', (done) => {
    socket.emit('authorize', `Bearer ${token}`);
    socket.emit('startListeningToMailbox', mailboxId);
    socket.once('newActivity', (activity) => {
      if (activity && activity.name === 'Tester') validEventEmitted = true;
    });
    activityDao.createPublishActivity(mailboxId, payload, (err, result) => {
      setTimeout(() => { validEventEmitted.should.be.equal(true); done(); }, 1500);
    });
  });

  it('should not receive activity in case new mailBoxId on a new connection is not authorized', (done) => {
    socket.emit('startListeningToMailbox', mailboxId);
    socket.once('newActivity', (activity) => {
      if (activity && activity.name === 'Tester') validEventEmitted = true;
    });
    activityDao.createPublishActivity(mailboxId, payload, (err, result) => {
      setTimeout(() => { validEventEmitted.should.be.equal(false); done(); }, 1500);
    });
  });
});

