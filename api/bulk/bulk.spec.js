/* eslint prefer-arrow-callback:0, func-names:0 */

const app = require('../../app');

const expect = require('chai').expect;

require('chai').should();

const request = require('supertest');

const mailboxDao = require('../../dao').mailbox;

const circleDao = require('../../dao').circle;

const followDAO = require('../../dao').follow;

const activityDao = require('../../dao').activity;

const bulkDao = require('../../dao').bulk;

describe('/getAllCircles API', () => {
  before(function (done) {
    for (let i=0; i<10; i += 1) {
      circleDao.createCircle(function (err, data) {
        if (err) { throw err; }
      });
    }
    setTimeout(() => {
      done();
    }, 500);
  });
  it('should return array of circles whose elements are from given range', function (done) {
    request(app)
      .get('/getallcircles/1/3')
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err4, res) => {
        (res.body.circles).should.be.a('Array').with.lengthOf(3);
        done();
      });
  });
});
