const followDao = require('../follow');

let followArr = [];

const publishActivityMailbox = [];

function sendToCircleMailbox(followArray, newActivity) {
  for (let i = 0; i < followArray.length; i += 1) {
    const newactivity = {
      newActivity,
      receiver: followArray[i].mailboxId,
    };
    publishActivityMailbox.push(newactivity);
  }
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
};
