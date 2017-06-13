<<<<<<< HEAD
const mailboxes = [];
let idCounter = -1;

// Function to create a mailbox which contains id

function createMailbox(req, res) {
  const createNewMailBox = {
    id: (idCounter += 1).toString(),
  };

  mailboxes.push(createNewMailBox);
  return createNewMailBox;
}

function checkIfMailboxExists(id) {
  const filteruserid = mailboxes.filter(userid => userid.id === id);
  return filteruserid.length!==0;
}
// Function to delete the mailbox with id. If id not exists returns no mailbox error
function deleteMailbox(id) {
  const filteruserid = mailboxes.filter(userid => userid.id === id);
  const mailBoxIndex = mailboxes.indexOf(filteruserid[0]);
  const x = mailboxes.splice(mailBoxIndex, 1);
  return x[0];
}

module.exports = {
  createMailbox,
  deleteMailbox,
  checkIfMailboxExists,
};

=======
const mailbox = [];
let idCounter = -1;

//Function to create a mailbox which contains id

function createMailbox(req, res) {
  const newmailbox = {
    id: idCounter += 1,
  };
  mailbox.push(newmailbox);
  return newmailbox;
}

function checkIfMailboxExists(id){
  let filteredMailbox =  mailbox.filter(userid => userid.id === id);
  return mailbox.indexOf(filteredMailbox[0]);
}

//Function to get the mailbox with particular id
// function retrieveMailbox(id) {
//   let mailBoxIndex = checkIfMailboxExists(id);
//   if (mailBoxIndex === -1) {
//     return null;
//   }
//   return mailbox[mailBoxIndex];
// }

//Function to delete the mailbox with id. If id not exists returns no mailbox error
function deleteMailbox(id) {
  let mailBoxIndex = checkIfMailboxExists(id);
 
   if (mailBoxIndex === -1) {
     return 0;
   }
  else {
    const x = mailbox.splice(mailBoxIndex, 1);
    return  x[0];
  }
}

module.exports = {
 checkIfMailboxExists,
 createMailbox,
 deleteMailbox,
};
>>>>>>> 46f33a223d92bbeb6a4d89f8dde91f79a6719884
