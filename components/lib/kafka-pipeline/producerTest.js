const send = require('./send');

send([{ topic: 't1', messages: [JSON.stringify({ foo: 'bar' })] }]);
