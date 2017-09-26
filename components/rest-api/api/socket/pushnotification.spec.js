const EventEmitter = require('events');

const authorize = require('../../authorize');

const bootstrapSocketServer = require('./socketserver');

const mailboxDao = require('../../dao').mailbox;

const circleDao = require('../../dao').circle;

const followDao = require('../../dao').follow;

const config = require('../../config').redis;

const publisher = require('redis').createClient([{ host: config.host, port: config.port }]);

require('chai').should();

describe('/push notifications using redis', function socketTests() {
  this.timeout(10000);
  let token;
  let socket;
  let io;
  let circleId;
  let mailboxId;
  const payload = {};
  payload.name = 'Tester';
  payload.timestamp = new Date();
  let validEventEmitted;
  const startedFollowing = new Date();
  beforeEach((done) => {
    validEventEmitted = false;
    token = authorize.generateJWTToken();
    io = new EventEmitter();
    socket = new EventEmitter();
    bootstrapSocketServer(io);
    io.emit('connection', socket);
    circleDao.createCircle((err, result) => {
      if (err) { done(err); return; }
      circleId = result.circleId;
      mailboxDao.createMailbox((error, result1) => {
        if (error) { done(error); return; }
        mailboxId = result1.mailboxId;
        followDao.addFollow({ circleId, mailboxId }, startedFollowing, (error1) => {
          if (error1) { done(error1); return; }
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

  // TODO : check if we can create rooms using EventEmitter
  /* it('it should push a notification when  a new activity is published to the delivery topic', (done) => {
    socket.emit('authorize', `Bearer ${token}`);
    socket.emit('startListeningToMailbox', { mid: mailboxId });
    publisher.publish(mailboxId, JSON.stringify(payload));
    socket.on('newActivity', (activity) => {
      activity = JSON.parse(activity);
      if (activity.name === 'Tester') validEventEmitted = true;
    });
    setTimeout(() => {
      validEventEmitted.should.equal(true);
      done();
    }, 1500);
  }); */

  it('it should fail when publish channel and subscribe channel are diferent', (done) => {
    socket.emit('startListeningToMailbox', { mid: mailboxId });
    publisher.publish(Math.floor(Math.random()*316312137), JSON.stringify(payload));
    socket.on('newActivity', (activity) => {
      const activityObj = JSON.parse(activity);
      if (activityObj.name === 'Tester') validEventEmitted = true;
    });
    setTimeout(() => {
      validEventEmitted.should.equal(false);
      done();
    }, 1500);
  });
  it('it should fail when authorized', (done) => {
    socket.emit('startListeningToMailbox', { mid: mailboxId });
    publisher.publish(mailboxId, JSON.stringify(payload));
    socket.on('newActivity', (activity) => {
      const activityObj = JSON.parse(activity);
      if (activityObj.name === 'Tester') validEventEmitted = true;
    });
    setTimeout(() => {
      validEventEmitted.should.equal(false);
      done();
    }, 1500);
  });
  it('it should fail when not listening to mailbox', (done) => {
    socket.emit('authorize', `Bearer ${token}`);
    publisher.publish(mailboxId, JSON.stringify(payload));
    socket.on('newActivity', (activity) => {
      const activityObj = JSON.parse(activity);
      if (activityObj.name === 'Tester') validEventEmitted = true;
    });
    setTimeout(() => {
      validEventEmitted.should.equal(false);
      done();
    }, 1500);
  });
});
