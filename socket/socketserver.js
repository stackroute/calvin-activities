const activityDAO = require('../dao').activity;

function bootstrapSocketServer(io){
	io.on('connection', (socket) => {
  		socket.on('publish', (data) => {
    		activityDAO.publishToMailbox(data.mid, data.message, function(err, result){});
  		});

  		socket.on('startListeningToMailbox', (mid) => {
    		activityDAO.addListnerToMailbox(mid, socket);
  		});

  		socket.on('stopListeningToMailbox', (mid) => {
    		activityDAO.removeListnerFromMailbox(mid, socket);
  		});
	});
}

module.exports = bootstrapSocketServer;
