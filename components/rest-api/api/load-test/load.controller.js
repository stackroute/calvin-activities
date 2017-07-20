const circleDAO = require('../../dao').circle;

const topic = 'as_demo_activities';

const config = require('../../../capacity-test-data/config').kafka;

const kafkaPipeline = require('kafka-pipeline');

let interval = null;

const arguements = process.argv[2].split(',');

let circlesList;

circleDAO.getAllCircles(100, (err, result) => {
   if (err) { res.status(500).json({ message: `${err}` }); return; }
   circlesList = result;  
});

 setInterval(() => { 
   const msg = arguements[0];
   console.log("msg-------------> "+msg);
   const n = arguements[1];
   console.log("no of msg/s------------------> "+n);
   
   postMsgToCircle(msg, n, circlesList, (err, result) => {
   if (err) { console.log('error:', err); return; }
   console.log(`PRODUCED ${n} records`);
   });
   },1000);

function postMsgToCircle(msg, n, circlelist, callback) {
  console.log(`PREPARING ${n} records for topic ${topic}`);
  const messages = [];
  for (let i=0; i<n; i++) {
    messages.push(JSON.stringify({Message: `${msg}` }));
  }
  console.log(`PRODUCING ${n} records`);
  const send = [];
  kafkaPipeline.producer.ready(function() { 
    // for (let i=0; i<1; i++) {
      send.push({ topic, messages : msg});
    // }
    console.log(`PUSHING: ${JSON.stringify(send)}`);
    kafkaPipeline.producer.send(send,callback);
 });
}

