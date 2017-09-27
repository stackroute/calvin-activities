const async = require('async');

const _ = require('lodash');

const chai = require('chai');

require('chai').should();

const chaiHttp = require('chai-http');

const socketClient = require('socket.io-client');

const expect = chai.expect;

chai.use(chaiHttp);

let allCircles = [];
let allMailboxes = [];
let allMailboxesWithCircleMailboxes = [];
let allActivities = [];
let allSockets = [];
let c1;
let c2;
let c3;
let c4;
let c5;
let m1;
let m2;
let m3;
let m4;
let m5;
let m6;
let m7;
let m8;
let m9;

const host = 'http://localhost:4000';
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiY2lyY2xlczphbGwiLCJmb2xsb3dzOmFsbCIsIm1haWxib3g6YWxsIl0sImlhdCI6MTUwMDU3MDYyMX0.YqHdtxTPeq5UoT9yUhQw9gziURvdHAfaiALOwlhGCTg';

function createOneCircle(callback) {
  chai.request(host)
    .post('/circle')
    .set('Authorization', token)
    .end((err, res) => {
      if (err) { callback(err); } else { callback(null, res.body); }
    });
}

function createCircles(circleCount, callback) {
  const tasks = [];
  for (let i = 0; i < circleCount; i += 1) {
    tasks.push(createOneCircle);
  }
  async.parallel(
    tasks,
    (error, result) => {
      if (error) { callback(error); } else { callback(null, result); }
    },
  );
}

function deleteOneCircle(circleId, callback) {
  chai.request(host)
    .del(`/circle/${circleId}`)
    .set('Authorization', token)
    .end((err) => {
      if (err) { callback(err); } else { callback(); }
    });
}

function deleteCircles(circles, callback) {
  const tasks = [];
  _.each(circles, (circle) => {
    tasks.push(deleteOneCircle.bind(null, circle));
  });
  async.parallel(
    tasks,
    (error) => {
      if (error) { callback(error); } else { callback(); }
    },
  );
}

function createOneMailbox(callback) {
  chai.request(host)
    .post('/mailbox')
    .set('Authorization', token)
    .end((err, res) => {
      if (err) { callback(err); } else { callback(null, res.body); }
    });
}

function createMailboxes(mailboxCount, callback) {
  const tasks = [];
  for (let i = 0; i < mailboxCount; i += 1) {
    tasks.push(createOneMailbox);
  }
  async.parallel(
    tasks,
    (error, result) => {
      if (error) { return callback(error); } else { return callback(null, result); }
    },
  );
}

function deleteOneMailbox(mailboxId, callback) {
  chai.request(host)
    .del(`/mailbox/${mailboxId}`)
    .set('Authorization', token)
    .end((err) => {
      if (err) { callback(err); } else { callback(); }
    });
}

function deleteMailboxes(mailboxes, callback) {
  const tasks = [];
  _.each(mailboxes, (mailbox) => {
    tasks.push(deleteOneMailbox.bind(null, mailbox));
  });
  async.parallel(
    tasks,
    (error) => {
      if (error) { callback(error); } else { callback(); }
    },
  );
}

function pushOneActivityToCircle(circleId, msgNumber, callback) {
  chai.request(host)
    .post(`/circle/${circleId}/activity`)
    .set('Authorization', token)
    .send({ msgNum: msgNumber, circleId })
    .end((err) => {
      if (err) { callback(err); } else { callback(); }
    });
}

function pushActivitiesToCircles(circles, activityCount, callback) {
  const tasks = [];
  _.each(circles, (circle) => {
    for (let i = 0; i < activityCount; i += 1) {
      tasks.push(pushOneActivityToCircle.bind(null, circle, i));
    }
  });
  async.series(
    tasks,
    (error) => {
      if (error) { return callback(error); } else { return callback(); }
    },
  );
}

function getActivitiesOfOneMailbox(mailboxId, callback) {
  chai.request(host)
    .get(`/mailbox/getallactivities/${mailboxId}?limit=1000000`)
    .set('Authorization', token)
    .end((err, res) => {
      if (err) { callback(err); } else {
        if (res && res.body && res.body.totalItems > 0) {
          console.log(`${mailboxId} : ${res.body.totalItems}`);
          const mailbox = _.filter(allActivities, { mailboxId });
          if (!mailbox || mailbox.length === 0) {
            allActivities.push({ mailboxId, activities: [] });
          }
          let thisMailboxActivities = _.filter(allActivities, { mailboxId })[0].activities;
          thisMailboxActivities = thisMailboxActivities.concat(res.body.items);
          _.filter(allActivities, { mailboxId })[0].activities = thisMailboxActivities;
        }
        callback();
      }
    });
}

function getActivitiesOfMailboxes(mailboxes, callback) {
  const tasks = [];
  _.each(mailboxes, (mailbox) => {
    tasks.push(getActivitiesOfOneMailbox.bind(null, mailbox));
  });
  async.parallel(
    tasks,
    (error) => {
      if (error) { return callback(error); } else { return callback(); }
    },
  );
}

function oneFollow(circleId, mailboxId, callback) {
  chai.request(host)
    .post(`/mailbox/${mailboxId}/circle/${circleId}`)
    .set('Authorization', token)
    .end((err) => {
      if (err) { callback(err); } else { callback(); }
    });
}

function followCircles(circles, mailboxes, callback) {
  const tasks = [];
  _.each(circles, (circle) => {
    _.each(mailboxes, (mailbox) => {
      tasks.push(oneFollow.bind(null, circle, mailbox));
    });
  });
  async.parallel(
    tasks,
    (error) => {
      if (error) { return callback(error); } else { return callback(); }
    },
  );
}

function oneUnfollow(circleId, mailboxId, callback) {
  chai.request(host)
    .del(`/mailbox/${mailboxId}/circle/${circleId}`)
    .set('Authorization', token)
    .end((err) => {
      if (err) { callback(err); } else { callback(); }
    });
}

function unfollowCircles(circles, mailboxes, callback) {
  const tasks = [];
  _.each(circles, (circle) => {
    _.each(mailboxes, (mailbox) => {
      tasks.push(oneUnfollow.bind(null, circle, mailbox));
    });
  });
  async.parallel(
    tasks,
    (error) => {
      if (error) { return callback(error); } else { return callback(); }
    },
  );
}

function setMailboxesOnline(mailboxes) {
  _.each(mailboxes, (mailbox) => {
    const socket = socketClient(host);
    socket.on('connect', () => {
      allSockets.push({ mailboxId: mailbox, socket, activities: [] });
    });
    socket.emit('authorize', token);
    socket.emit('startListeningToMailbox', { mid: mailbox });
    socket.on('newActivity', (activity) => {
      _.filter(allSockets, { mailboxId: mailbox })[0].activities.push(activity);
    });
  });
}

function setMailboxesOffline(mailboxes) {
  _.each(allSockets, (conn) => {
    if (mailboxes.indexOf(conn.mailboxId) > -1) {
      conn.socket.emit('stopListeningToMailbox', { mid: conn.mailboxId });
      conn.socket.removeAllListeners();
      conn.socket.disconnect();
    }
  });
}

describe('Messages posted to circle', function circleMessageTest() {
  this.timeout(20000);
  it('gets delivered to circle mailbox immediately', (done) => {
    chai.request(host)
      .post('/circle')
      .set('Authorization', token)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.should.have.status(201);
        expect(res.body).to.be.an('object').to.have.property('circleId');
        expect(res.body).to.be.an('object').to.have.property('mailboxId');
        expect(res.body).to.be.an('object').to.have.property('createdOn');
        const circleId = res.body.circleId;
        const circleMailboxId = res.body.mailboxId;
        if (!circleId || !circleMailboxId) { done(); return; }
        setTimeout(() => {
          chai.request(host)
            .post(`/circle/${circleId}/activity`)
            .set('Authorization', token)
            .send({ link: 'www.facebook.com' })
            .end((err1, res1) => {
              if (err1) { done(err1); return; }
              res1.should.have.status(201);
              expect(res1.body).to.be.an('object').to.have.property('payload');
              expect(res1.body.payload).to.be.an('object').to.have.property('link');
              setTimeout(() => {
                chai.request(host)
                  .get(`/mailbox/getallactivities/${circleMailboxId}`)
                  .set('Authorization', token)
                  .end((err2, res2) => {
                    if (err2) { done(err2); return; }
                    res2.should.have.status(200);
                    expect(res2.body).to.be.an('object').to.have.property('items');
                    expect(res2.body).to.be.an('object').to.have.property('totalItems');
                    expect(res2.body).to.be.an('object').to.have.property('first');
                    expect(res2.body).to.be.an('object').to.have.property('last');
                    expect(res2.body.totalItems).to.equal(1);
                    done();
                  });
              }, 8000);
            });
        }, 3000);
      });
  });
});

describe('Messages posted to mailbox', () => {
  it('gets delivered to mailbox immediately', (done) => {
    chai.request(host)
      .post('/mailbox')
      .end((err, res) => {
        if (err) { done(err); return; }
        res.should.have.status(201);
        expect(res.body).to.be.an('object').to.have.property('mailboxId');
        const mailboxId = res.body.mailboxId;
        if (!mailboxId) { done(); return; }
        chai.request(host)
          .post(`/mailbox/${mailboxId}/activitytomailbox`)
          .set('Authorization', token)
          .send({ link: 'www.facebook.com' })
          .end((err1, res1) => {
            if (err1) { done(err1); return; }
            res1.should.have.status(201);
            expect(res1.body).to.be.an('object').to.have.property('payload');
            expect(res1.body.payload).to.be.an('object').to.have.property('link');
            chai.request(host)
              .get(`/mailbox/getallactivities/${mailboxId}`)
              .set('Authorization', token)
              .end((err2, res2) => {
                if (err2) { done(err2); return; }
                res2.should.have.status(200);
                expect(res2.body).to.be.an('object').to.have.property('items');
                expect(res2.body).to.be.an('object').to.have.property('totalItems');
                expect(res2.body).to.be.an('object').to.have.property('first');
                expect(res2.body).to.be.an('object').to.have.property('last');
                expect(res2.body.totalItems).to.equal(1);
                done();
              });
          });
      });
  });
});

describe('Messages posted to circle', function socketMessagesTest() {
  this.timeout(120000);
  allSockets = [];
  before((done) => {
    createCircles(5, (error, result) => {
      if (error) { done(error); return; }
      allCircles = _.map(result, 'circleId');
      allMailboxesWithCircleMailboxes = _.map(result, 'mailboxId');

      createMailboxes(9, (error1, result1) => {
        if (error1) { done(error1); return; }
        allMailboxes = _.map(result1, 'mailboxId');
        allMailboxesWithCircleMailboxes.concat(_.map(result1, 'mailboxId'));

        c1 = allCircles[0];
        c2 = allCircles[1];
        c3 = allCircles[2];
        c4 = allCircles[3];
        c5 = allCircles[4];

        m1 = allMailboxes[0];
        m2 = allMailboxes[1];
        m3 = allMailboxes[2];
        m4 = allMailboxes[3];
        m5 = allMailboxes[4];
        m6 = allMailboxes[5];
        m7 = allMailboxes[6];
        m8 = allMailboxes[7];
        m9 = allMailboxes[8];

        done();
      });
    });
  });

  beforeEach((done) => {
    allActivities = [];
    for (let i=0; i<allSockets.length; i+=1) {
      allSockets[i].activities = [];
    }
    done();
  });

  describe('All non-following users, whether online or offline', () => {
    before((done) => {
      setMailboxesOnline([m1, m2, m3, m5, m8, m9], () => {});
      done();
    });

    it('will not receive the message', (done) => {
      setTimeout(() => {
        pushActivitiesToCircles([c1, c2, c3, c4, c5], 1000, (err) => {
          if (err) { done(err); }
        });
      }, 3000);

      setTimeout(() => {
        getActivitiesOfMailboxes([m1, m2, m3, m4, m5, m6, m7, m8, m9], (err) => {
          if (err) { done(err); return; }
          expect(allActivities.length).to.equal(0);
          expect(_.filter(allSockets, { mailboxId: m1 })[0].activities.length).to.equal(0);
          expect(_.filter(allSockets, { mailboxId: m2 })[0].activities.length).to.equal(0);
          expect(_.filter(allSockets, { mailboxId: m3 })[0].activities.length).to.equal(0);
          expect(_.filter(allSockets, { mailboxId: m5 })[0].activities.length).to.equal(0);
          expect(_.filter(allSockets, { mailboxId: m8 })[0].activities.length).to.equal(0);
          expect(_.filter(allSockets, { mailboxId: m9 })[0].activities.length).to.equal(0);
          done();
        });
      }, 35000);
    });

    after((done) => {
      setMailboxesOffline([m1, m2, m3, m5, m8, m9], () => {});
      done();
    });
  });

  describe('All following users who are online', () => {
    before((done) => {
      followCircles([c1], [m1, m2, m3], () => {});
      followCircles([c3], [m3, m4], () => {});
      followCircles([c4], [m2, m3, m5], () => {});
      followCircles([c5], [m6, m7, m8], () => {});

      setTimeout(() => { setMailboxesOnline([m1, m3, m5, m8, m9], () => {}); }, 2000);

      done();
    });

    it('will receive message immediately in mailbox and as push notifications', (done) => {
      setTimeout(() => {
        pushActivitiesToCircles([c1, c2, c3, c4, c5], 1000, (err) => {
          if (err) { done(err); }
        });
      }, 8000);

      setTimeout(() => {
        getActivitiesOfMailboxes([m1, m2, m3, m4, m5, m6, m7, m8, m9], (err) => {
          if (err) { done(err); return; }
          expect(_.filter(allActivities, { mailboxId: m1 }).length).to.equal(1);
          expect(_.filter(allActivities, { mailboxId: m1 })[0].activities.length).to.equal(2000);
          expect(_.filter(allSockets, { mailboxId: m1 })[0].activities.length).to.equal(1000);
          expect(_.filter(allActivities, { mailboxId: m2 }).length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m3 }).length).to.equal(1);
          expect(_.filter(allActivities, { mailboxId: m3 })[0].activities.length).to.equal(6000);
          expect(_.filter(allSockets, { mailboxId: m3 })[0].activities.length).to.equal(3000);
          expect(_.filter(allActivities, { mailboxId: m4 }).length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m5 }).length).to.equal(1);
          expect(_.filter(allActivities, { mailboxId: m5 })[0].activities.length).to.equal(2000);
          expect(_.filter(allSockets, { mailboxId: m5 })[0].activities.length).to.equal(1000);
          expect(_.filter(allActivities, { mailboxId: m6 }).length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m7 }).length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m8 }).length).to.equal(1);
          // expect(_.filter(allActivities, { mailboxId: m8 })[0].activities.length).to.equal(2000);
          // expect(_.filter(allSockets, { mailboxId: m8 })[0].activities.length).to.equal(1000);
          expect(_.filter(allActivities, { mailboxId: m9 }).length).to.equal(0);
          done();
        });
      }, 100000);
    });
  });

  describe('All following users who are online and they goes offline', () => {
    before((done) => {
      setMailboxesOffline([m1, m3, m5, m8, m9], () => {});

      done();
    });

    it('will stop receiving messages', (done) => {
      setTimeout(() => {
        pushActivitiesToCircles([c1, c2, c3, c4, c5], 1000, (err) => {
          if (err) { done(err); }
        });
      }, 8000);

      setTimeout(() => {
        getActivitiesOfMailboxes([m1, m2, m3, m4, m5, m6, m7, m8, m9], (err) => {
          if (err) { done(err); return; }
          expect(_.filter(allActivities, { mailboxId: m1 }).length).to.equal(1);
          expect(_.filter(allActivities, { mailboxId: m1 })[0].activities.length).to.equal(2000);
          expect(_.filter(allSockets, { mailboxId: m1 })[0].activities.length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m2 }).length).to.equal(0);
          expect(_.filter(allSockets, { mailboxId: m2 })[0].activities.length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m3 }).length).to.equal(1);
          expect(_.filter(allActivities, { mailboxId: m3 })[0].activities.length).to.equal(6000);
          expect(_.filter(allSockets, { mailboxId: m3 })[0].activities.length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m4 }).length).to.equal(0);
          expect(allSockets).to.not.include({ mailboxId: m4 });
          expect(_.filter(allActivities, { mailboxId: m5 }).length).to.equal(1);
          expect(_.filter(allActivities, { mailboxId: m5 })[0].activities.length).to.equal(2000);
          expect(_.filter(allSockets, { mailboxId: m5 })[0].activities.length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m6 }).length).to.equal(0);
          expect(allSockets).to.not.include({ mailboxId: m6 });
          expect(_.filter(allActivities, { mailboxId: m7 }).length).to.equal(0);
          expect(allSockets).to.not.include({ mailboxId: m7 });
          expect(_.filter(allActivities, { mailboxId: m8 }).length).to.equal(1);
          // expect(_.filter(allActivities, { mailboxId: m8 })[0].activities.length).to.equal(2000);
          // expect(_.filter(allSockets, { mailboxId: m8 })[0].activities.length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m9 }).length).to.equal(0);
          expect(_.filter(allSockets, { mailboxId: m9 })[0].activities.length).to.equal(0);
          done();
        });
      }, 75000);
    });
  });

  describe('All following users who are not online and they comes online', () => {
    before((done) => {
      setMailboxesOnline([m1, m3, m5, m8, m9], () => {});

      done();
    });

    it('will receive previous messages', (done) => {
      setTimeout(() => {
        pushActivitiesToCircles([c1, c2, c3, c4, c5], 1000, (err) => {
          if (err) { done(err); }
        });
      }, 8000);

      setTimeout(() => {
        getActivitiesOfMailboxes([m1, m2, m3, m4, m5, m6, m7, m8, m9], (err) => {
          if (err) { done(err); return; }
          expect(_.filter(allActivities, { mailboxId: m1 }).length).to.equal(1);
          expect(_.filter(allActivities, { mailboxId: m1 })[0].activities.length).to.equal(4000);
          expect(_.filter(allSockets, { mailboxId: m1 })[0].activities.length).to.equal(1000);
          expect(_.filter(allActivities, { mailboxId: m2 }).length).to.equal(0);
          expect(_.filter(allSockets, { mailboxId: m2 })[0].activities.length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m3 }).length).to.equal(1);
          expect(_.filter(allActivities, { mailboxId: m3 })[0].activities.length).to.equal(12000);
          expect(_.filter(allSockets, { mailboxId: m3 })[0].activities.length).to.equal(3000);
          expect(_.filter(allActivities, { mailboxId: m4 }).length).to.equal(0);
          expect(allSockets).to.not.include({ mailboxId: m4 });
          expect(_.filter(allActivities, { mailboxId: m5 }).length).to.equal(1);
          expect(_.filter(allActivities, { mailboxId: m5 })[0].activities.length).to.equal(4000);
          expect(_.filter(allSockets, { mailboxId: m5 })[0].activities.length).to.equal(1000);
          expect(_.filter(allActivities, { mailboxId: m6 }).length).to.equal(0);
          expect(allSockets).to.not.include({ mailboxId: m6 });
          expect(_.filter(allActivities, { mailboxId: m7 }).length).to.equal(0);
          expect(allSockets).to.not.include({ mailboxId: m7 });
          expect(_.filter(allActivities, { mailboxId: m8 }).length).to.equal(1);
          // expect(_.filter(allActivities, { mailboxId: m8 })[0].activities.length).to.equal(4000);
          // expect(_.filter(allSockets, { mailboxId: m8 })[0].activities.length).to.equal(1000);
          expect(_.filter(allActivities, { mailboxId: m9 }).length).to.equal(0);
          expect(_.filter(allSockets, { mailboxId: m9 })[0].activities.length).to.equal(0);
          done();
        });
      }, 35000);
    });
  });

  describe('All following users who starts unfollowing', () => {
    before((done) => {
      unfollowCircles([c1], [m1, m2, m3], () => {});
      unfollowCircles([c3], [m3, m4], () => {});
      unfollowCircles([c4], [m2, m3, m5], () => {});
      unfollowCircles([c5], [m6, m7, m8], () => {});

      done();
    });

    it('will not receive the message', (done) => {
      setTimeout(() => {
        pushActivitiesToCircles([c1, c2, c3, c4, c5], 1000, (err) => {
          if (err) { done(err); }
        });
      }, 8000);

      setTimeout(() => {
        getActivitiesOfMailboxes([m1, m2, m3, m4, m5, m6, m7, m8, m9], (err) => {
          if (err) { done(err); return; }
          expect(_.filter(allActivities, { mailboxId: m1 }).length).to.equal(1);
          expect(_.filter(allSockets, { mailboxId: m1 })[0].activities.length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m1 })[0].activities.length).to.equal(4000);
          expect(_.filter(allActivities, { mailboxId: m2 }).length).to.equal(0);
          expect(_.filter(allSockets, { mailboxId: m2 })[0].activities.length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m3 }).length).to.equal(1);
          expect(_.filter(allActivities, { mailboxId: m3 })[0].activities.length).to.equal(12000);
          expect(_.filter(allSockets, { mailboxId: m3 })[0].activities.length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m4 }).length).to.equal(0);
          expect(allSockets).to.not.include({ mailboxId: m4 });
          expect(_.filter(allActivities, { mailboxId: m5 }).length).to.equal(1);
          expect(_.filter(allActivities, { mailboxId: m5 })[0].activities.length).to.equal(4000);
          expect(_.filter(allSockets, { mailboxId: m5 })[0].activities.length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m6 }).length).to.equal(0);
          expect(allSockets).to.not.include({ mailboxId: m6 });
          expect(_.filter(allActivities, { mailboxId: m7 }).length).to.equal(0);
          expect(allSockets).to.not.include({ mailboxId: m7 });
          expect(_.filter(allActivities, { mailboxId: m8 }).length).to.equal(1);
          // expect(_.filter(allActivities, { mailboxId: m8 })[0].activities.length).to.equal(4000);
          // expect(_.filter(allSockets, { mailboxId: m8 })[0].activities.length).to.equal(0);
          expect(_.filter(allActivities, { mailboxId: m9 }).length).to.equal(0);
          expect(_.filter(allSockets, { mailboxId: m9 })[0].activities.length).to.equal(0);
          done();
        });
      }, 35000);
    });

    after((done) => {
      setMailboxesOffline([m1, m3, m5, m8, m9], () => {});
      done();
    });
  });

  after((done) => {
    console.log([c1, c2, c3, c4, c5, m1, m2, m3, m4, m5, m6, m7, m8, m9]);
    deleteCircles([c1, c2, c3, c4, c5], (error) => {
      if (error) { done(error); }
    });
    deleteMailboxes([m1, m2, m3, m4, m5, m6, m7, m8, m9], (error) => {
      if (error) { done(error); }
    });
    _.each(allSockets, (conn) => {
      conn.socket.removeAllListeners();
      conn.socket.disconnect();
    });
    done();
  });
});

describe('Multiple connections by same user', function multipleConnectionsTest() {
  this.timeout(10000);
  let mailboxId;
  let circleId;
  let socket1;
  let socket2;
  const socket1Activities = [];
  const socket2Activities = [];

  before((done) => {
    chai.request(host)
      .post('/mailbox')
      .set('Authorization', token)
      .end((err, res) => {
        if (err) { done(err); return; }
        res.should.have.status(201);
        expect(res.body).to.be.an('object').to.have.property('mailboxId');
        mailboxId = res.body.mailboxId;
        if (!mailboxId) { done('Error - mailbox not created'); return; }

        chai.request(host)
          .post('/circle')
          .set('Authorization', token)
          .end((err1, res1) => {
            if (err1) { done(err1); return; }
            res1.should.have.status(201);
            expect(res1.body).to.be.an('object').to.have.property('circleId');
            expect(res1.body).to.be.an('object').to.have.property('mailboxId');
            expect(res1.body).to.be.an('object').to.have.property('createdOn');
            circleId = res1.body.circleId;
            if (!circleId) { done('Error - circle not created'); return; }

            chai.request(host)
              .post(`/mailbox/${mailboxId}/circle/${circleId}`)
              .set('Authorization', token)
              .end((err2, res2) => {
                if (err2) { done(err2); return; }
                res2.should.have.status(201);
                expect(res2.body).to.be.an('object').to.have.property('circleId');
                expect(res2.body).to.be.an('object').to.have.property('mailboxId');

                socket1 = socketClient(host);
                socket1.on('connect', () => {
                });
                socket1.emit('authorize', token);
                socket1.on('newActivity', (activity) => {
                  socket1Activities.push(activity);
                });

                socket2 = socketClient(host);
                socket2.on('connect', () => {
                });
                socket2.emit('authorize', token);
                socket2.on('newActivity', (activity) => {
                  socket2Activities.push(activity);
                });

                done();
              });
          });
      });
  });

  it('user get individual notifications on all screens he is logged-in', (done) => {
    socket1.emit('startListeningToMailbox', { mid: mailboxId });
    socket2.emit('startListeningToMailbox', { mid: mailboxId });

    setTimeout(() => {
      chai.request(host)
        .post(`/mailbox/${mailboxId}/activitytomailbox`)
        .set('Authorization', token)
        .send({ link: 'www.facebook.com' })
        .end((err, res) => {
          if (err) { done(err); return; }
          res.should.have.status(201);
          expect(res.body).to.be.an('object').to.have.property('payload');
          expect(res.body.payload).to.be.an('object').to.have.property('link');
        });
    }, 3000);

    setTimeout(() => {
      chai.request(host)
        .get(`/mailbox/getallactivities/${mailboxId}`)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) { done(err); return; }
          res.should.have.status(200);
          expect(res.body).to.be.an('object').to.have.property('items');
          expect(res.body).to.be.an('object').to.have.property('totalItems');
          expect(res.body).to.be.an('object').to.have.property('first');
          expect(res.body).to.be.an('object').to.have.property('last');
          expect(res.body.totalItems).to.equal(1);
          expect(socket1Activities.length).to.equal(1);
          expect(socket2Activities.length).to.equal(1);

          done();
        });
    }, 8000);
  });

  it('if user logs outs from one screen, he gets individual notifications on other screens', (done) => {
    socket1.emit('stopListeningToMailbox', { mid: mailboxId });


    setTimeout(() => {
      chai.request(host)
        .post(`/mailbox/${mailboxId}/activitytomailbox`)
        .set('Authorization', token)
        .send({ link: 'www.facebook.com' })
        .end((err, res) => {
          if (err) { done(err); return; }
          res.should.have.status(201);
          expect(res.body).to.be.an('object').to.have.property('payload');
          expect(res.body.payload).to.be.an('object').to.have.property('link');
        });
    }, 3000);

    setTimeout(() => {
      chai.request(host)
        .get(`/mailbox/getallactivities/${mailboxId}`)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) { done(err); return; }
          res.should.have.status(200);
          expect(res.body).to.be.an('object').to.have.property('items');
          expect(res.body).to.be.an('object').to.have.property('totalItems');
          expect(res.body).to.be.an('object').to.have.property('first');
          expect(res.body).to.be.an('object').to.have.property('last');
          expect(res.body.totalItems).to.equal(2);
          expect(socket1Activities.length).to.equal(1);
          expect(socket2Activities.length).to.equal(2);

          done();
        });
    }, 8000);
  });

  it('if user is not logged-in, he doesnot get the individual notifications', (done) => {
    socket2.emit('stopListeningToMailbox', { mid: mailboxId });

    setTimeout(() => {
      chai.request(host)
        .post(`/mailbox/${mailboxId}/activitytomailbox`)
        .set('Authorization', token)
        .send({ link: 'www.facebook.com' })
        .end((err, res) => {
          if (err) { done(err); return; }
          res.should.have.status(201);
          expect(res.body).to.be.an('object').to.have.property('payload');
          expect(res.body.payload).to.be.an('object').to.have.property('link');
        });
    }, 3000);

    setTimeout(() => {
      chai.request(host)
        .get(`/mailbox/getallactivities/${mailboxId}`)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) { done(err); return; }
          res.should.have.status(200);
          expect(res.body).to.be.an('object').to.have.property('items');
          expect(res.body).to.be.an('object').to.have.property('totalItems');
          expect(res.body).to.be.an('object').to.have.property('first');
          expect(res.body).to.be.an('object').to.have.property('last');
          expect(res.body.totalItems).to.equal(3);
          expect(socket1Activities.length).to.equal(1);
          expect(socket2Activities.length).to.equal(2);

          done();
        });
    }, 8000);
  });

  it('user get channel notifications on all screens he is logged-in', (done) => {
    socket1.emit('startListeningToMailbox', { mid: mailboxId });
    socket2.emit('startListeningToMailbox', { mid: mailboxId });

    setTimeout(() => {
      chai.request(host)
        .post(`/circle/${circleId}/activity`)
        .set('Authorization', token)
        .send({ link: 'www.facebook.com' })
        .end((err, res) => {
          if (err) { done(err); return; }
          res.should.have.status(201);
          expect(res.body).to.be.an('object').to.have.property('payload');
          expect(res.body.payload).to.be.an('object').to.have.property('link');
        });
    }, 3000);

    setTimeout(() => {
      chai.request(host)
        .get(`/mailbox/getallactivities/${mailboxId}`)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) { done(err); return; }
          res.should.have.status(200);
          expect(res.body).to.be.an('object').to.have.property('items');
          expect(res.body).to.be.an('object').to.have.property('totalItems');
          expect(res.body).to.be.an('object').to.have.property('first');
          expect(res.body).to.be.an('object').to.have.property('last');
          expect(res.body.totalItems).to.equal(4);
          expect(socket1Activities.length).to.equal(2);
          expect(socket2Activities.length).to.equal(3);

          done();
        });
    }, 8000);
  });

  it('if user logs outs from one screen, he gets channel notifications on other screens', (done) => {
    socket1.emit('stopListeningToMailbox', { mid: mailboxId });


    setTimeout(() => {
      chai.request(host)
        .post(`/circle/${circleId}/activity`)
        .set('Authorization', token)
        .send({ link: 'www.facebook.com' })
        .end((err, res) => {
          if (err) { done(err); return; }
          res.should.have.status(201);
          expect(res.body).to.be.an('object').to.have.property('payload');
          expect(res.body.payload).to.be.an('object').to.have.property('link');
        });
    }, 3000);

    setTimeout(() => {
      chai.request(host)
        .get(`/mailbox/getallactivities/${mailboxId}`)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) { done(err); return; }
          res.should.have.status(200);
          expect(res.body).to.be.an('object').to.have.property('items');
          expect(res.body).to.be.an('object').to.have.property('totalItems');
          expect(res.body).to.be.an('object').to.have.property('first');
          expect(res.body).to.be.an('object').to.have.property('last');
          expect(res.body.totalItems).to.equal(5);
          expect(socket1Activities.length).to.equal(2);
          expect(socket2Activities.length).to.equal(4);

          done();
        });
    }, 8000);
  });

  it('if user is not logged-in, he doesnot get the channel notifications', (done) => {
    socket2.emit('stopListeningToMailbox', { mid: mailboxId });

    setTimeout(() => {
      chai.request(host)
        .post(`/circle/${circleId}/activity`)
        .set('Authorization', token)
        .send({ link: 'www.facebook.com' })
        .end((err, res) => {
          if (err) { done(err); return; }
          res.should.have.status(201);
          expect(res.body).to.be.an('object').to.have.property('payload');
          expect(res.body.payload).to.be.an('object').to.have.property('link');
        });
    }, 3000);

    setTimeout(() => {
      chai.request(host)
        .get(`/mailbox/getallactivities/${mailboxId}`)
        .set('Authorization', token)
        .end((err, res) => {
          if (err) { done(err); return; }
          res.should.have.status(200);
          expect(res.body).to.be.an('object').to.have.property('items');
          expect(res.body).to.be.an('object').to.have.property('totalItems');
          expect(res.body).to.be.an('object').to.have.property('first');
          expect(res.body).to.be.an('object').to.have.property('last');
          expect(res.body.totalItems).to.equal(5);
          expect(socket1Activities.length).to.equal(2);
          expect(socket2Activities.length).to.equal(4);

          done();
        });
    }, 8000);
  });
});

