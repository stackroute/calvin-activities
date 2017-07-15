const kafkaClient = require('../../client/kafkaclient');

const producer = kafkaClient. producer;

function sendevent(event) {
    let messages = JSON.stringify(event);
    payloads = [
        {
            topic: 'events', messages: messages , partition: 0
        },
    ];
    producer.send(payloads, function (err, data) {
        console.log(data);
    });
    producer.on('error', function (err) { console.log("errr"); })
}

module.exports = {
    sendevent
}

