const EventEmitter = require('events');
const authorize = require('../../authorize');
const bootstrapSocketServer = require('./socketserver');
const mailboxDao = require('../../dao').mailbox;
const circleDao = require('../../dao').circle;
const followDao = require('../../dao').follow;
const publisher = require("redis").createClient([{host:'172.23.238.134', port:'6379'}]);
require('chai').should();

describe('/push notifications', () => {
  let token;
  let socket;
  let io;
  let circleId;
  let mailboxId;
  const payload = {};
  payload.name = 'Tester';
  let validEventEmitted;
  beforeEach((done) => {
    validEventEmitted = false;
    token = authorize.generateJWTToken();
    io = new EventEmitter();
    socket = new EventEmitter();
    bootstrapSocketServer(io);
    io.emit('connection', socket);
    circleDao.createCircle((err, result) => {
      circleId = result.id;
      mailboxDao.createMailbox((error, result1) => {
        mailboxId = result1.id;
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
  it('it should push a notification when  a new activity is published to the delivery topic',(done) => {
    socket.emit('authorize', `Bearer ${token}`);
    socket.emit('startListeningToMailbox', mailboxId);
    publisher.publish(mailboxId, JSON.stringify(payload));
    socket.on('newActivity', (activity) => {
      activity = JSON.parse(activity);
      if (activity.name === 'Tester') validEventEmitted = true;
      validEventEmitted.should.equal(true);
      done();
    });
  });
  it('it should fail when publish channel and subscribe channel are diferent',(done) => {
    socket.emit('startListeningToMailbox', mailboxId);
    publisher.publish(Math.floor(Math.random()*316312137), JSON.stringify(payload));
    socket.on('newActivity', (activity) => {
      activity = JSON.parse(activity);
      if (activity.name === 'Tester') validEventEmitted = true;
    });
    setTimeout(() => {
       validEventEmitted.should.equal(false);
      done();
    },1500);
  });
  it('it should fail when authorized',(done) => {
    socket.emit('startListeningToMailbox', mailboxId);
    publisher.publish(mailboxId, JSON.stringify(payload));
    socket.on('newActivity', (activity) => {
      activity = JSON.parse(activity);
      if (activity.name === 'Tester') validEventEmitted = true;
    });
    setTimeout(() => {
       validEventEmitted.should.equal(false);
      done();
    },1500);
  });
    it('it should fail when not listening to mailbox',(done) => {
    socket.emit('authorize', `Bearer ${token}`);
    publisher.publish(mailboxId, JSON.stringify(payload));
    socket.on('newActivity', (activity) => {
      activity = JSON.parse(activity);
      if (activity.name === 'Tester') validEventEmitted = true;
    });
    setTimeout(() => {
       validEventEmitted.should.equal(false);
      done();
    },1500);
  });
});
