const followapi = [];
const circles=[];
const mailbox=[];
let idCounter = -1;
let id=0;

function addFollow(circleId, mailboxId) {
  const newuser = {
    circleId,
    mailboxId,
  };
  followapi.push(newuser);
  return newuser;
}

function checkIfFollowExists(circleId, mailboxId) {
  const filteredFollowers = followapi.filter(follow => follow.circleId === circleId && follow.mailboxId === mailbox);
  return filteredFollowers.length !== 0;
}

function deleteFollow(circleId, mailboxId) {
  const filter = followapi.filter(y => y.circleId === circleId && y.mailboxId === mailboxId);
  followapi.splice(followapi.indexOf(filter[0]), 1);
  return filter[0];
}

function createCircle() {
  const newcircle = {
    id: (id += 1).toString(),
  };
  circles.push(newcircle);
  return newcircle;
}
function deleteCircle(circleId) {
  const filter = circles.filter(y => y.id === circleId);

  circles.splice(circles.indexOf(filter[0]), 1);
  return filter[0];
}
function checkIfCircleExists(circleId) {
  const filtercircle = circles.filter(circle => circle.id === circleId);
  if (filtercircle.length===0) {
    return false;
  }
  return true;
}

function createMailbox(req, res) {
  const newmailbox = {
    id: (idCounter += 1).toString(),
  };
  mailbox.push(newmailbox);
  return newmailbox;
}

function checkIfMailboxExists(id) {
  const filteredMailbox = mailbox.filter(userid => userid.id == id);
  if (mailbox.indexOf(filteredMailbox[0]) !== -1) { return true; }
  return false;
}

function deleteMailbox(id) {
  const mailBoxIndex = checkIfMailboxExists(id);

  if (mailBoxIndex === -1) {
    return 0;
  } else {
    const x = mailbox.splice(mailBoxIndex, 1);
    return x[0];
  }
}
module.exports = {
  deleteFollow,
  addFollow,
  checkIfFollowExists,
  createCircle,
  createMailbox,
  createCircle,
  deleteCircle,
  checkIfCircleExists,
  checkIfMailboxExists,
  createMailbox,
  deleteMailbox,
};
