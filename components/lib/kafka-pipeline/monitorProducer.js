const config = require('../config.json');

let kafka = require('kafka-node'),
  KeyedMessage = kafka.KeyedMessage;

Producer = kafka.Producer,
client = new kafka.Client(config.connectionString, config.clientId);
producer = new Producer(client);
let count=0;
function registerProducer(topicName, monitorTopic, message, callback) {
  ++count;
	    console.log(`message===>${message} count============>>> ${count}`);

  payloads = [
    { topic: `${topicName}`, messages: 'hi' },


  ];

  producer.on('ready', () => {
    producer.send(payloads, (err, data) => {
    // console.log('send inside registerProducer===>',payloads);
      if (err) { console.log(`${err}`); return; }
      // produceToMonitor(monitorTopic,count,topicName);
      return callback(payloads);
    });
  });

  producer.on('error', (err) => { console.log(`${err}`); });
  console.log('count in registerProducer===>', count);
  setInterval(() => {
    console.log('monitorTopic==>', monitorTopic);
    payloads = [
      { topic: `${monitorTopic}`, message: `${count}` },

    ];
    producer.send(payloads, (err, data) => {
      if (err) { console.log(`${err}`); return; }

      return payloads;
    });
  }, 1000);


  producer.on('error', (err) => { console.log('eerrr'); });
}

// setInterval( registerProducer, 2000,'multiplexer','hi',callback);

// setInterval(function() { registerProducer('multiplexer','hi'); },  2000);

// function produceToMonitor(monitorTopic,count,topicName){
// 	// let mesg = JSON.stringify(payload);

// 	console.log('monitorTopic==>'+JSON.stringify(topicName)+'count==>'+count);

// // for(let key in topicName) {
// // 	 if(topicName.hasOwnProperty(key)){
// // 	 	console.log('topicName', topicName[key][key]);
// // const msg ={
// // 	topicName: topicName[key],
// // 	count: count
// // }
// // console.log('msg==>',msg);
// // 	 }

// // 	}

// payloads = [
//         { topic: `${monitorTopic}`, message:`${count}`}

//     ];
//    //  console.log('payloads inside produceToMonitor===>',payloads);
//     // sendcount=payloads[0].count;

// 	// console.log("inside ready");
//     producer.send(payloads, function (err, data) {

//         if(err) { console.log(`${err}`); return; }
//         // console.log('payloads===>',payloads);
//            //  console.log('send===>',payloads);
//               return payloads;
// });
// // });
// producer.on('error', function (err) { console.log("eerrr"); return; })

// }

// setInterval(registerProducer, 600);
module.exports = { registerProducer };
