let kafka = require('kafka-node'),
  Producer = kafka.Producer,
  client = new kafka.Client(),
  producer = new Producer(client);

producer.on('ready', () => {
  producer.createTopics(['M2','M1D'], true, (err, data) => {
    if (err) { console.log(err); }
    console.log(data);
  });
});
