// const app = require('../app');

// const expect = require('chai').expect;

// const request = require('supertest');

// require('chai').should();

// const mailboxDao = require('../dao').mailbox;

// const circleDao = require('../dao').circle;

// const followDAO = require('../dao').follow;

// const routeService = require('../services/routes');

// const multiplexerRouteService = require('../services/multiplexer-route');

// const authorize = require('../authorize');

// const multiplexer = require('./index');
// const multiconsumer = require('./multiplexerconsumer');
// const redisClient = require('../client/redisclient').client;

// const client = require('../client/kafkaclient').client;
// const producer = require('../client/kafkaclient').producer;
// const topic = require('../client/kafkaclient').topic;
// // const Consumer = require('../client/kafkaclient').Consumer;
// const consumer = require('../client/kafkaclient').consumer;
// // const Consumer = require('../client/kafkaclient').Consumer;

// const kafka = require('kafka-node');

// const Consumer = kafka.Consumer;

// describe('/Multiplexer', () => {
//   let circleId;
//   let mailboxId;
//   let token;
//   let namespace;
//   before((done) => {
//     namespace ='m1';
//     // token = authorize.generateJWTToken();
//     circleDao.createCircle((err, result) => {
//       if (err) { throw err; }
//       circleId = result.id;
//       console.log(`circleId inside before${circleId}`);
//       mailboxDao.createMailbox((error, result1) => {
//         if (error) { throw error; }
//         mailboxId = result1.id;
//         followDAO.addFollow({ circleId, mailboxId }, (error1, result2) => {
//           if (error) { throw error1; }
//           routeService.addRoute(circleId, mailboxId, (error2, result3) => {
//             if (error2) { throw error2; }
//             setTimeout(() => {
//               done();
//             }, 1500);
//           });
//           done();
//         });
//       });
//     });
//   });

//   it('should create mailbox,circle,follow and add route', (done) => {
//     console.log(`mailboxId--->${mailboxId}circleId--->${circleId}`);
//     console.log(`namespace--->${namespace}`);
//     mailboxDao.checkIfMailboxExists(mailboxId, (err, doesMailboxExists) => {
//       doesMailboxExists.should.be.equal(true);
//     });
//     circleDao.checkIfCircleExists(circleId, (err1, doesCircleExists) => {
//       doesCircleExists.should.be.equal(true);
//     });
//     followDAO.checkIfFollowExists({ circleId, mailboxId }, (err2, doesFollowExistsBefore) => {
//       doesFollowExistsBefore.should.be.equal(true);
//     });
//     multiplexerRouteService.checkIfRouteExists({ namespace, circleId, mailboxId }, (err1, doesRouteExist1) => {
//       doesRouteExist1.should.be.equal(true);
//     });
//     done();
//   });


//   it('producer and consumer', (done) => {
//     producer.on('ready', () => {
//       console.log('inside producer');
//       producer.createTopics(['M1'], true, (err, data) => {
//         console.log('topic created');
//         if (err) { console.log(err); }
//         console.log(`data==>${data}`);
//       });
//     });
//     console.log(`circleId outside before${circleId}`);
//     const msg1 = {
//       payload: {
//         name: 'mnbvc',
//         activity: 'test case',
//       },
//       circleId: `${circleId}`,
//     };

//     console.log(`msg1===>${JSON.stringify(msg1)}`);
//     const payloads = [
//       { topic: 'M1', messages: JSON.stringify(msg1) },

//     ];
//     console.log(`payloads${JSON.stringify(payloads)}`);
//     expect(payloads.topic).to.equals('M1');
//     producer.on('ready', () => {
//       producer.send(payloads, (err, data) => {

//       });
//     });


//     // expect(circleId).to.equals(msg1.circleId);
//     // console.log('arr[circleId]'+arr[circleId]);
//     // expect(JSON.stringify(msg1.payload).to.equals(arr[circleId]));
//     done();
//   });
// });
