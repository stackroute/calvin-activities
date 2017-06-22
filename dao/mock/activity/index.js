const followDao = require('../follow');

const listeners = {};

const activities = {};


function publishActivityToListeners(mid, activity) {
  if (!listeners[mid]) { return; }
  console.log(listeners);
  listeners[mid].forEach((socket) => {
    socket.emit('newActivity', activity);
  });
}

function publishToMailbox(mid, activity, callback) {
  if (!activities[mid]) { activities[mid] = []; }
  activities[mid].unshift(activity);
  publishActivityToListeners(mid, activity);
  return callback(null, activity);
}

function createPublishActivity(mid, activity, callback) {
  publishToMailbox(mid, activity, (error, result) => {
    followDao.splitMailId(mid, (error1, followersMailboxId) => {
      if (!followersMailboxId) { return callback(null, activity); } else {
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
    if (err) { return callback(err, null); }
    if (MailIdExists === false) {
      return callback([], null);
    } else {
      return callback(null, activities[mid]);
    }
  });
}

function addListnerToMailbox(mid, socket) {
  if (!listeners[mid]) { listeners[mid] = []; }
  listeners[mid].unshift(socket);
}

function removeListnerFromMailbox(mid, socket) {
  const index = listeners[mid].indexOf(socket);
  listeners[mid].splice(index, 1);
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
  removeListnerFromMailbox,
  retriveMessageFromMailbox,
  checkIfMailboxEmpty,
  checkActivityPublished,
};
