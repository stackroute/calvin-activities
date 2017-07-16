const multiplexerconsumer = require('./multiplexerconsumer');

multiplexerconsumer.multiplexer((err, result) => {
   if(err) { console.log(`${err}`); return; }
   console.log(result);
});
