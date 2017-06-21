const followDao = require('../follow');

const mailboxDao = require('../mailbox');

const listeners = {};

const activities = {};

function publishToMailbox(mid, activity, callback) {
  if (!activities[mid]) { activities[mid] = []; }
  activities[mid].unshift(activity);
  return callback(null, activity);
}

function createPublishActivity(mid, activity, callback) {
  publishToMailbox(mid, activity, (error, result) => {
    followDao.splitMailId(mid, (error1, followersMailboxId) => {
      if (!followersMailboxId) { console.log('1'); return callback(null, activity); } else {
        for (let i = 0; i < followersMailboxId.length; i += 1) {
          const mailboxId = followersMailboxId[i].mailboxId;
          publishToMailbox(mailboxId, activity, (err, data) => { if (err) callback(err, null); });
        }
      }
      return callback(null, activity);
    });
  });
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
