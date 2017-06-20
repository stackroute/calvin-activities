const followDao = require('../follow');

const mailboxDao = require('../mailbox');

const listeners = {};

const activities = {};

function publishToMailbox(mid, activity, callback) {
  if (!activities[mid]) { activities[mid] = []; }
  activities[mid].unshift(activity);
  return callback(null, { mid, activity });
}

function retriveMessageFromMailbox(mid, done) {
  return done(null, activities[mid]);
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


function createPublishActivity(mid, activity, callback) {
  publishToMailbox(mid, activity, callback);
  for (let i = 0; i < followDao.splitMailId(mid).length; i += 1) {
    const mailId = followDao.splitMailId(mid)[i].mailboxId;
    publishToMailbox(mid, activity, callback);
  }
  return callback(null, { mid, activity });
}

function checkActivityPublished(mailId, callback) {
  return callback(null, activities[mailId]);
}

function deleteActivity(mailboxId) {
  console.log(` Before deleteActivity${JSON.stringify(activities)}`);

  delete activities[mailboxId];
  // activities = null;delete myObject['regex'];
  // delete activities;
  console.log(`deleteActivity${JSON.stringify(activities)}`);
  // console.log(`inside deleteActivity${JSON.stringify(act)}`);

  return activities;
}

module.exports = {
  publishToMailbox,
  addListnerToMailbox,
  createPublishActivity,
  retriveMessageFromMailbox,
  checkIfMailboxEmpty,
  checkActivityPublished,
  deleteActivity,
};
