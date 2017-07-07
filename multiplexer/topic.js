const kafka = require('kafka-node');

const Producer = kafka.Producer;
const client = new kafka.Client();
const producer = new Producer(client);

producer.on('ready', () => {
  producer.createTopics(['M2', 'M1D'], true, (err, data) => {
    if (err) { // console.log(err);
    }
    // console.log(data);
  });
});
