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

describe('getAllCircles API', () => {
    before(function (done) {
        for (let i = 1; i <= 10; i += 1) {
            circleDao.createCircle(function (err, data) {
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
                console.log(res.body.length);
                expect(res.body.length).to.be.above(0);
                done();
            });
    });
});

