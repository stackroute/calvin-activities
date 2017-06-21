const followDao = require('../follow');

const mailboxDao = require('../mailbox');

const listeners = {};

const activities = {};

function publishToMailbox(mid, activity) {
  if (!activities[mid]) { activities[mid] = []; }
  activities[mid].unshift(activity);
  return activities;
}

function createPublishActivity(mid, activity, callback) {
  publishToMailbox(mid, activity);
  for (let i = 0; i < followDao.splitMailId(mid).length; i += 1) {
    const mailId = followDao.splitMailId(mid)[i].mailboxId;
    publishToMailbox(mailId, activity);
  }
  return callback(null, (mid, activity));
}


function checkIfMailboxExists(mid, callback) {
  const filterMailId = activities[mid];
  if (!filterMailId) { return callback(null, false); }
  return callback(null, filterMailId);
}

function retriveMessageFromMailbox(mid, callback) {
  checkIfMailboxExists(mid, (err, MailIdExists) => {
    if (err) { console.log(`inside err part${err}`); return callback(err, null); }
    if (MailIdExists === false) {
      return callback([], null);
    } else {
      return callback(null, activities[mid]);
    }
  });
}

function addListnerToMailbox(mid, socket) {
  socket.on('startListeningToMailBox', (data) => {
    listeners[mid].unshift(socket);
  });


  socket.on('stopListeningToMailbox', (data) => {
    const index = listeners[mid].indexOf(socket);
    listeners[mid].splice(index, 1);
  });
}

function checkIfMailboxEmpty() {
  return activities;
}


function checkActivityPublished(mailId, callback) {
  return callback(null, activities[mailId]);
}


module.exports = {
  publishToMailbox,
  addListnerToMailbox,
  createPublishActivity,
  retriveMessageFromMailbox,
  checkIfMailboxEmpty,
  checkActivityPublished,
};
