const followDao = require('../follow');

const mailboxDao = require('../mailbox');

const listeners = {};

const activities = {};

function publishToMailbox(mid, activity) {
  if (!activities[mid]) { activities[mid] = []; }
  activities[mid].unshift(activity);
  console.log(JSON.stringify(activities));
  return activities;
}

function retriveMessageFromMailbox(mid) {
  return activities[mid];
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


function createPublishActivity(mid, activity) {
  publishToMailbox(mid, activity);
  for (let i = 0; i < followDao.splitMailId(mid).length; i += 1) {
    const mailId = followDao.splitMailId(mid)[i].mailboxId;
    publishToMailbox(mailId, activity);
  }
  return activity;
}

function checkActivityPublished(mailId) {
  return activities[mailId];
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
// function createAnActivity(mid, newActivity) {
//   console.log(`createactivity${publishToMailbox(mid, newActivity)}`);
//   return JSON.stringify(publishToMailbox(mid, newActivity));
// }
module.exports = {
  publishToMailbox,
  addListnerToMailbox,
  createPublishActivity,
  retriveMessageFromMailbox,
  checkIfMailboxEmpty,
  checkActivityPublished,
  deleteActivity,
};
