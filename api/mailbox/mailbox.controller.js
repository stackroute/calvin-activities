const mailbox = [];
let idCounter = -1;

function createNewMail(req, res) {
  const newmailbox = {
    id: idCounter += 1,
  };
  mailbox.push(newmailbox);
  res.status(201).json(newmailbox);
}

function retrieveAllMail(req, res) {
  res.status(200).json(mailbox);
}

function retrievemail(req, res) {
  const id = +req.params.id;
  const filteruserid = mailbox.filter(userid => userid.id === id);
  if (filteruserid.length === 0) {
    res.status(404).send(); return;
  }
  res.status(200).json(filteruserid[0]);
}


function deletemail(req, res) {
  const id = +req.params.id;
  const filteruserid = mailbox.filter(userid => userid.id === id);
  if (filteruserid.length === 0) {
    res.status(404).send('ID not found'); return;
  }

  const index = mailbox.indexOf(filteruserid[0]);
  mailbox.splice(index, 1);
  res.status(200).json(filteruserid[0]);
}

module.exports = {
  retrieveAllMail,
  createNewMail,
  retrievemail,
  deletemail,
};
