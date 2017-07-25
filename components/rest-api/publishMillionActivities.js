// const winston = require('winston');
// const circleDAO = require('./dao').circle;
// const mailboxDAO = require('./dao').mailbox;
// const followDAO = require('./dao').follow;
// const activityDAO = require('./dao').activity;
// const routesManagerService = require('./services/routes');

// const circles = [];
// const mailboxes = [];
// const startFollowing = new Date();
// const activity = {
//   type: 'Activity',
//   name: 'Sallie uploaded a document',
//   messageNumber: 0,
// };
// let i;

// for (i = 0; i < 5; i += 1) {
//   circleDAO.createCircle((err, result) => {
//     if (err) { throw err; }
//     circles.push(result.id);
//   });
// }

// for (i = 0; i< 5; i += 1) {
//   mailboxDAO.createMailbox((err, result) => {
//     if (err) { throw err; }
//     mailboxes.push(result.id);
//   });
// }

// setTimeout(() => {
//   circles.forEach((circleId) => {
//     mailboxes.forEach((mailboxId) => {
//       followDAO.addFollow({ circleId, mailboxId }, startFollowing, (err, result) => {
//         if (err) { throw err; }
//         winston.log(result);
//         routesManagerService.addRoute(circleId, mailboxId, (err1, result1) => {
//           winston.log('added route');
//           if (err) { throw err; }
//           winston.log(result1);
//         });
//       });
//     });
//   });
// }, 10000);


// // setTimeout(() => {
// //   winston.log(`Started pushing messages to activities topic..${new Date().getTime()}`);
// //   circles.forEach((circleId) => {
// //     for (i = 0; i< 100; i += 1) {
// //       activity.messageNumber = i;
// //       activity.cId = circleId;
// //       activityDAO.createPublishActivity(circleId, activity, (err, result) => {
// //         if (err) { throw err; }
// //         winston.log(result);
// //       });
// //     }
// //   });
// //   winston.log(`Stopped pushing messages to activities topic..${new Date().getTime()}`);
// // }, 20000);

// circle

var unirest = require("unirest");
const circles = [];
const mailboxes = [];

for ( var i = 0; i < 100; i+=1){

var req = unirest("POST", "http://172.23.238.180:4000/circle");

req.headers({
  "postman-token": "7274537b-a6df-cdbc-684a-195e7187b815",
  "cache-control": "no-cache",
  "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1heWFuayBTZXRoaSIsImFwaSI6ImNpcmNsZSIsInNjb3BlcyI6WyJtYWlsYm94OmFsbCIsImNpcmNsZTphbGwiLCJmb2xsb3c6YWxsIl0sImlhdCI6MTQ5NzkzODEzOX0.cpLAt8BaYZyqyp53iDJGbl3yIBtBjj6_qoSiM4_hDiY",
  "content-type": "application/json"
});

req.type("json");
req.send({
  "id": "[57a99139-210f-4b5c-9511-a61481d8297c,37dc9dd7-a68d-4122-8f09-009a73eb2f52,5e4f1a11-d972-4e0b-9e57-856217511347]"
});

req.end(function (res) {
  if (res.error) throw new Error(res.error);
  circles.push(res.body.circleId);
  });
}

// mailbox
setTimeout(function() {
  for ( var i = 0; i <1000; i+=1){
  var req = unirest("POST", "http://172.23.238.180:4000/mailbox");

  req.headers({
    "postman-token": "efc6d453-e27c-0575-0422-498ae87a06cb",
    "cache-control": "no-cache",
    "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1heWFuayBTZXRoaSIsImFwaSI6ImNpcmNsZSIsInNjb3BlcyI6WyJtYWlsYm94OmFsbCIsImNpcmNsZTphbGwiLCJmb2xsb3c6YWxsIl0sImlhdCI6MTQ5NzkzODEzOX0.cpLAt8BaYZyqyp53iDJGbl3yIBtBjj6_qoSiM4_hDiY",
    "content-type": "application/json"
  });

  req.type("json");
  req.send({
    "id": "[57a99139-210f-4b5c-9511-a61481d8297c,37dc9dd7-a68d-4122-8f09-009a73eb2f52,5e4f1a11-d972-4e0b-9e57-856217511347]"
  });

  req.end(function (res) {
    if (res.error) throw new Error(res.error);


    mailboxes.push(res.body.mailboxId);

  });
  }

}, 2000);


// setTimeout(function() {
//   //follow
// circles.forEach((circleId) => {
//   mailboxes.forEach((mailboxId) => {
//   var req = unirest("POST", `http://172.23.238.180:4000/mailbox/${mailboxId}/circle/${circleId}`);
//   req.headers({
//     "postman-token": "c353e818-ab76-0298-5504-c5c4762ce73c",
//     "cache-control": "no-cache",
//     "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1heWFuayBTZXRoaSIsImFwaSI6ImNpcmNsZSIsInNjb3BlcyI6WyJtYWlsYm94OmFsbCIsImNpcmNsZTphbGwiLCJmb2xsb3c6YWxsIl0sImlhdCI6MTQ5NzkzODEzOX0.cpLAt8BaYZyqyp53iDJGbl3yIBtBjj6_qoSiM4_hDiY",
//     "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
//   });

//   req.multipart([]);

//   req.end(function (res) {
//     if (res.error) throw new Error(res.error);
//   });
//   });
//   });

// }, 6000);

setTimeout (function(){
circles.forEach((circleId) => {
var req = unirest("POST", `http://172.23.238.180:4000/bulk/${circleId}`);


req.headers({
  "postman-token": "dea717c5-bc9a-f579-424c-682532513e56",
  "cache-control": "no-cache",
  "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1heWFuayBTZXRoaSIsImFwaSI6ImNpcmNsZSIsInNjb3BlcyI6WyJtYWlsYm94OmFsbCIsImNpcmNsZTphbGwiLCJmb2xsb3c6YWxsIl0sImlhdCI6MTQ5NzkzODEzOX0.cpLAt8BaYZyqyp53iDJGbl3yIBtBjj6_qoSiM4_hDiY",
  "content-type": "application/json"
});
// console.log(`${mailboxes.join(',')}`);
req.type("json");
req.send({
  "id": `[${mailboxes.join(',')}]`
});

req.end(function (res) {
  if (res.error) throw new Error(res.error);

  // console.log(res.body);
});
});

}, 6000);