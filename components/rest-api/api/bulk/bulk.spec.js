/* eslint prefer-arrow-callback:0, func-names:0, no-loop-func:0 */

require('chai').should();

const expect = require('chai').expect;

const request = require('supertest');

const app = require('../../app');

const authorize = require('../../authorize');

const mailboxDao = require('../../dao').mailbox;

const circleDao = require('../../dao').circle;

describe('add bulk followers for a circle API', function addBulkTests() {
  this.timeout(60000);
  let token;

  before((done) => {
    token = authorize.generateJWTToken();
    done();
  });

  it('should add bulk mailboxes for a circles as followers', (done) => {
    const mailboxIds = [];
    let circleId;
    for (let i = 0; i <= 5; i+=1) {
      mailboxDao.createMailbox((err, result) => {
        if (err) { done(err); return; }
        mailboxIds.push(result.mailboxId);
      });
    }
    circleDao.createCircle((err, result) => {
      if (err) { done(err); return; }
      circleId = result.circleId;
    });
    setTimeout(function () {
      request(app)
        .post(`/mailbox/bulk/${circleId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ mailboxIds })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((error) => {
          if (error) { done(error); }
        });
    }, 1000);
    setTimeout(function () {
      request(app)
        .get(`/mailbox/mailboxes/${mailboxIds[0]}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((error1, res1) => {
          if (error1) { done(error1); return; }
          expect(res1.body.items[0].circleid).to.equal(circleId);
          done();
        });
    }, 2000);
  });
});
