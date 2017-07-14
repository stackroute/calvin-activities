const producer1 = require('./register-producer');
const producer2 = require('./monitorProducer')
function producer(msg) {
    
    // console.log('Successfull  :', msg);
        
 }
// const topicName =[ {t1:'t1',t2:'t2',t3:'t3'}];
   const monitorTopic = 't2';
const topic='t1';
 // console.log('topic name in index',topicName);
// const message = 'hello world';
for(i=0;i<10;i++){
// producer1.registerProducer(topicName, monitorTopic, i, producer);
producer2.registerProducer(topic,monitorTopic, i, producer);
console.log("inside  index2 "+i);
}

// setInterval(function() { registerProducer('multiplexer','hi'); },  2000);
