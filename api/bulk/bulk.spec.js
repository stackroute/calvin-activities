require('chai').should();
const expect = require('chai').expect;
const request = require('supertest');

const app = require('../../app');

const start = require('../../db');

const mailboxDao = require('../../dao').mailbox;

const circleDao = require('../../dao').circle;

const followDao = require('../../dao').follow;

const uuid = start.uuid;

const authorize = require('../../authorize');

describe('/getAllCircles API', () => {
    let a = [];
    before(function (done) {
        for (let i = 1; i <= 2; i += 1) {
            circleDao.createCircle(function (err, data) {
                if (err) { throw err; }
                a.push(data.circleId);
            });
        }
        setTimeout(() => {
            done();
        }, 1500);
    });
    afterEach(function (done) {
        for (let i = 1; i >= 0; i -= 1) {
            let circleId = a[i];
            circleDao.deleteCircle(circleId, function (err, data) {
                if (err) { throw err; }
            });
        }
        done();
    });

    it('should return all circle', function (done) {
        request(app)
            .get('/getallcircles')
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                expect(res.body.length).to.be.above(1);
                done();
            });
    });

    it('should not return circleId if does not exists', function (done) {
        for (let i = 1; i >= 0; i -= 1) {
            let circleId = a[i];
            circleDao.deleteCircle(circleId, function (err, data) {
                if (err) { throw err; }
            });
        }

        request(app)
            .get('/getallcircles')
            .expect(404)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                expect(res.body).to.be.an('array').that.is.empty;
                done();
            });
    });

}); //end of describe
