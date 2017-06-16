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
  socket.on('startListeningToMailBox', (data) => {
    listners[mid].push(socket);
  });

  socket.on('stopListeningToMailbox', (data) => {
    const index=listners[mid].indexOf(socket);
    listners[mid].splice(index, 1);
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
  sendToCircleMailbox,
  createPublishActivity,
  checkIfActivityPublished,
  publishActivityMailbox,
};
