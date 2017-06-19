const followDao = require('../follow');

const listeners = { };

const activities = { };

function publishToMailbox(mid, activity) {
  if (!activities[mid]) { activities[mid]=[]; }
  activities[mid].unshift(activity);

  // listeners[mid].forEach((socket) => {mailboxId
  //   socket.emit('new activity', activity);
  // });
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
    const index=listeners[mid].indexOf(socket);
    listeners[mid].splice(index, 1);
  });
}

function checkIfMailboxEmpty() {
  return activities;
}


function createPublishActivity(mid, activity) {
  publishToMailbox(mid, activity);
  // sendToCircleMailbox(followDao.splitMailId(mid), activity);

  for (let i = 0; i < followDao.splitMailId(mid).length; i += 1) {
    // console.log(followArr[i].mailboxId);
    const mailId = followDao.splitMailId(mid)[i].mailboxId;
    publishToMailbox(mailId, activity);
  }
  // if (!activities[mid]) { activities[mid]=[]; }
  // activities[mid].shift(activity);
  // followArr = followDao.splitMailId(mid);
  // console.log(followArr);

  return activity;
}

// function checkIfActivityPublished() {
//   // const filterMailBox = activities.filter(userid => userid.receiver === mailboxId);
//   // return filterMailBox.length !== 0;
//   console.log(`activities${JSON.stringify(activities)}`);
//   return activities;
// }

function checkActivityPublished(mailId) {
  console.log(Object.keys(activities).length);
  console.log(JSON.stringify(activities));
  return activities[mailId];
}

module.exports = {
  publishToMailbox,
  addListnerToMailbox,
  createPublishActivity,
  retriveMessageFromMailbox,
  checkIfMailboxEmpty,
  checkActivityPublished,
};
