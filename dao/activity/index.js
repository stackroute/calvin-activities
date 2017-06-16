const followDao = require('../follow');

const listeners = { };

const activities = { };

function publishToMailbox(mid, activity) {
  activities[mid].shift(activities);
  listeners[mid].forEach((socket) => {
    socket.emit('new activity', activity);
  });
}

function retriveMessageFromMailbox(mid) {
  return activities[mid];
}

function addListnerToMailbox(mid, socket) {
  socket.on('startListeningToMailBox',function(data){
    listeners[mid].push(socket);
  });

  socket.on('stopListeningToMailbox', function(data){
    const index=listeners[mid].indexOf(socket);
    listeners[mid].splice(index,1);
  });
}

function createPublishActivity(newActivity) {
  publishActivityMailbox.push(newActivity);
  followArr = followDao.splitMailId(newActivity.receiver);
  sendToCircleMailbox(followArr, newActivity);
  return newActivity;
}

function checkIfActivityPublished(mailboxId) {
  const filterMailBox = publishActivityMailbox.filter(userid => userid.receiver === mailboxId);

  return filterMailBox.length !== 0;
}

module.exports = {
  publishToMailbox,
  addListnerToMailbox,
  addListnerToMailbox,
  createPublishActivity,
  checkIfActivityPublished,
  publishActivityMailbox,
};
