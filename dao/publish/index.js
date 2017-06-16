const followDao = require('../follow');

let followArr = [];
const publishActivityCircle = [];
const publishActivityMailbox = [];

// let idCounter = -1;  "circleId": "1",  "mailboxId": "1"


// function to publish activity from circle to each mailbox

// TODO: Rename sendToCircleMailbox to sendToCircle
function sendToCircleMailbox(followArray, newActivity) {
  // console.log(`Follow arr${followArr}`);
  // console.log("circleId"+receiver);
  for (let i = 0; i < followArray.length; i += 1) {
    // console.log(followArr[i].mailboxId);
    const newactivity = {
      newActivity,
      receiver: followArray[i].mailboxId,
    };
    publishActivityMailbox.push(newactivity);
  }
  // console.log(`new act${newActivity}`);
}

function createPublishActivityMailbox(req, res) {
  // console.log('Index file in dao');
  const payload=req.body;
  const newActivity = {
    timestamp: req.timestamp,
    payload,
    receiver: req.params.mailboxId,
  };

  publishActivityMailbox.push(newActivity);
  return newActivity;
}

// Function to publish an activity to a circle
function createPublishActivityCircle(req, res) {
  // console.log('Index file in dao');
  const payload=req.body;
  const newActivity = {
    timestamp: req.timestamp,
    payload,
    receiver: req.params.circleId,
  };
    // console.log(`receiver${req.params.circleId}`);
  publishActivityCircle.push(newActivity);
  followArr = followDao.splitMailId(req.params.circleId);
  sendToCircleMailbox(followArr, newActivity);
  return newActivity;
}


//  for(let i in followArr){
//   if(followArr[i] == receiver){
//  console.log("compared  "+followArr[i].mailboxId+'receiver   '+receiver);
//  publishActivityMailbox.push(newActivity);
//  console.log('publishActivityMailbox'+publishActivityMailbox);
// }
// }

// Function to get an activity to a circle
function getPublishActivityCircle(id) {
  const filterActivity = publishActivityCircle.filter(Id => Id.receiver === id);
  // console.log('filteractivity'+filterActivity[0]);
  delete filterActivity[0].receiver;
  return filterActivity[0];
}
// Function to get an activity to a mailbox
function getPublishActivityMailbox(id) {
  const filterActivity = publishActivityMailbox.filter(Id => Id.receiver === id);
  // const filteredFollowers = followapi.filter(filterData);
  delete filterActivity[0].receiver;
  return filterActivity[0];
}

function checkIfActivityPublished(mailboxId) {
  // console.log(mailboxId);
  // console.log(`publishActivityCircle${publishActivityCircle}`);
  // console.log(`publishActivityMailbox${publishActivityMailbox}`);

  // const filterData = follow => follow.mailboxId === follower.mailboxId;
  const filterMailBox = publishActivityCircle.filter(userid => userid.receiver === mailboxId);
  // console.log(`filterMailBox${filterMailBox}`);
  // return filterMailBox;
  return filterMailBox.length !== 0;
}
// console.log(checkIfActivityPublished(mailboxId));

module.exports = {
  createPublishActivityCircle,
  createPublishActivityMailbox,
  getPublishActivityCircle,
  getPublishActivityMailbox,
  checkIfActivityPublished,
};
