/* eslint prefer-arrow-callback:0, func-names:0, no-loop-func:0*/
const EventEmitter = require('events');
require('chai').should();
const request = require('supertest');
const app = require('../../app');
const start = require('../../db');
const mailboxDao = require('../../dao').mailbox;
const circleDao = require('../../dao').circle;
const followDao = require('../../dao').follow;

const uuid = start.uuid;
const authorize = require('../../authorize');
const bootstrapSocketServer = require('../socket/socketserver');

describe('/getOpenMailboxes API', () => {
    const sockets = [];
    const mailboxIds = [];
    let io;
    let token;
    beforeEach((done) => {
        token = authorize.generateJWTToken();
        io = new EventEmitter();
        bootstrapSocketServer(io);
        for (let i = 0; i < 10; i += 1) {
            const socket = new EventEmitter();
            io.emit('connection', socket);
            sockets.push(socket);
            mailboxDao.createMailbox((error, result) => { 
                console.log(error);
                mailboxIds.push(result.mailboxId);
            });
        }  
    //     console.log(mailboxIds);  
    //     for (let i = 0; i < 10; i += 1) {
    //         const random = Math.ceil(Math.random() * 9);
    //         sockets[random].emit('authorize', `Bearer ${token}`);
    //         const mid = mailboxIds[Math.ceil(Math.random() * 9)]
    //          sockets[random].emit('startListeningToMailbox', mid);
    //     }
    //     setTimeout(function () {
            done();
    //     }, 1500);
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
                    console.log(res.body);
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
});

    // describe('add bulk followers for a circle API', () => {

    //     it('should add bulk mailboxes for a circles as followers', function (done) {
    //         let mailboxId = [];
    //         for (i = 0; i <= 5; i++) {
    //             mailboxDao.createMailbox((err, result) => {
    //                 mailboxId.push(result.mailboxId);
    //             });
    //         }
    //         circleDao.createCircle((err, result) => {
    //             circleId = result.circleId;
    //         });
    //         // console.log(`circleId${circleId}`);
    //         console.log(`mailbox${mailboxId}`);
    //     });
    // });
