/* eslint prefer-arrow-callback:0, func-names:0 */
require('chai').should();
const io = require('socket.io-client');
// const server= require('./socketserver.js');

describe(" ",function(){
    let socket ;
    before(function () {
         socket = io('http://localhost:5000');
    });
    it('should not receive new Activity when it is published', function (done) {
       socket.on('newActivity', function(data){
            console.log(data);
            data.should.be.equal("hello").a("string");
            done(new Error('Received Activity')); 
        });

        setTimeout(() => {
            done();
        }, 1999);
        socket.emit('startListeningToMailbox',"abc");
        socket.emit('publish', ({"mid":"abc","message":"hello"}));
    });
    // it('it should receive new activity when listening and then published', function (done) {
    //     socket.on('newActivity', function(data){
    //         console.log(data);
    //         data.should.be.equal("hello").a("string");
    //         done(); 
    //     });
    //     socket.emit('startListeningToMailbox',"abc");
    //     socket.emit('publish', ({"mid":"abc","message":"hello"}));
    // });
    // it('it should stop receiving new activity after stopped listening and then published', function (done) {

    //     done();
    // });

});
