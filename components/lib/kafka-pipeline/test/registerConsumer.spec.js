const registerConsumer = require('../register-consumer');
const kafka = require('kafka-node');

const { HighLevelProducer } = kafka;
const chai = require('chai');

chai.should();

describe('registerConsumer', () => {
  before((done) => {
    const client = new kafka.Client();
    const producer = new HighLevelProducer(client);

    client.createTopics(['topic'], true, (err, res) => {
      const send = [{ topic: 'topic', messages: [{ foo: 'bar' }, { foo: 'bar' }, { foo: 'bar' }] }];
      producer.send(send, (err, reply) => {
        if (err) { done(err); return; }
        console.log('reply:', reply);
        done();
      });
    });
  });

  it('done', (done) => {
    done();
  });

  it('should receive 3 messages', function (done) {
    this.timeout(10000);
    let count = 0;

    registerConsumer({ host: 'localhost', port: 2181 }, 'topic', 'foo', (msg, callback) => {
      msg.should.have.property('foo').and.should.be.equal('bar');
      callback();
      if (++count === 3) { done(); }
    });
  });
});
