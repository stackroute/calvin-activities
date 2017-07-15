const config = require('../config.json');

let kafka = require('kafka-node'),
  KeyedMessage = kafka.KeyedMessage;

Producer = kafka.Producer,
client = new kafka.Client(config.connectionString, config.clientId);
producer = new Producer(client);
let count=0;
function registerProducer(topicName, monitorTopic, message, callback) {
  // console.log('topicname===>',topicName[0].t2);
  ++count;
  const msg = {
    payload: {
  	  count: `${count}`,
    },
  };
	  //  console.log('message===>',msg);

  payloads = [
    { topic: `${topicName[0].t1}`, messages: 'hi' },
    { topic: `${topicName[0].t2}`, messages: 'hi' },
    { topic: `${topicName[0].t3}`, messages: 'hi' },

  ];
  // console.log('payloads in===>',payloads);
  // sendcount=payloads[0].count;
  producer.on('ready', () => {
    producer.send(payloads, (err, data) => {
    // console.log('send inside registerProducer===>',payloads);

      if (err) { console.log(`${err}`); return; }
      console.log('payloads in registerProducer===>', payloads);

      produceToMonitor(monitorTopic, count, topicName);
      return callback(payloads);
    });
  });


  producer.on('error', (err) => { console.log(`${err}`); });
}

// setInterval( registerProducer, 2000,'multiplexer','hi',callback);

// setInterval(function() { registerProducer('multiplexer','hi'); },  2000);

function produceToMonitor(monitorTopic, count, topicName) {
  // let mesg = JSON.stringify(payload);

  console.log(`monitorTopic==>${JSON.stringify(topicName)}count==>${count}`);
  // producer.on('ready', function () {
  // topicName.forEach( function (arrayItem)
  // {
  //     var x = arrayItem.prop1 + 2;
  //     alert(x);
  // });
  // for (var key in dictionary) {
  //     if (dictionary.hasOwnProperty(key) {
  //         console.log(key, dictionary[key]);
  //     }
  // }
  for (const key in topicName) {
	 if (topicName.hasOwnProperty(key)) {
	 	console.log('topicName', topicName[key][key]);
      const msg ={
        topicName: topicName[key],
        count,
      };
      console.log('msg==>', msg);
	 }
  }

  payloads = [
    { topic: `${monitorTopic}`, message: `${count}` },

  ];
  //  console.log('payloads inside produceToMonitor===>',payloads);
  // sendcount=payloads[0].count;

  // console.log("inside ready");
  producer.send(payloads, (err, data) => {
    if (err) { console.log(`${err}`); return; }
    // console.log('payloads===>',payloads);
    //  console.log('send===>',payloads);
    return payloads;
  });
  // });
  producer.on('error', (err) => { console.log('eerrr'); });
}

// setInterval(registerProducer, 600);
module.exports = { registerProducer, produceToMonitor };
