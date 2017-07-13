// const app = require('../app');

// const expect = require('chai').expect;

// require('chai').should();

// const request = require('supertest');

// const multiplexerDelivery = require('./index');

// const kafkaClient = require('../client/kafkaclient').client;
// const producer = require('../client/kafkaclient').producer;
// const topic = require('../client/kafkaclient').topic;

// const name = 'priyanga';
// const check = 'priyanga';


// multiplexerDelivery.onmessage((err, data) => {
//   if (err) {
//     console.log(err);
//   } else {
//     const Delivery = data;
//     // console.log(data.topic);
//   }
// });
// describe('/Multiplexer Deliverys', () => {
//   before((done) => {
//     producer.on('ready', () => {
//       producer.createTopics(['NEW'], true, (err, data) => {
//         if (err) { console.log(err); }
//         console.log(data);
//       });
//     });
//     const msg1 = {
//       payload: {
//         name: 'uwhruhwrhwfjwhfuhjnxjnjwjn',
//       },
//       mailboxId: '',
//     };
//     const payloads = [
//       { topic: 'NEW', messages: JSON.stringify(msg1) },

//     ];
//     producer.on('ready', () => {
//       producer.send(payloads, (err, data) => {
//         console.log(data);
//       });
//     });
//   });


//   it('check (for mailbox id', (done) => {
//     request(app)
//       .expect(name).to.equals(check);
//     done();
//   });
// });
