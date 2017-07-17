const start = require('../client/dse');

const client = start.client;

function getCirclesForMailbox(mailboxId, callback) {
  const query = (`SELECT  circleid from circlesfollowedbymailbox where mailboxId = ${mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { throw err; }
    return callback(err, result);
  });
}
function getMailboxIdForCircle(circleId, callback) {
  const query = (`SELECT mailboxid from circle where circleid = ${circleId}`);
  client.execute(query, (err, result) => {
    if (err) { throw err; }
    return callback(err, result);
  })
}

function getLastMessageOfMailbox(mailboxId, callback) {
  const query = (`SELECT payload from activity where mailboxid = ${mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { throw err; }
    return callback(err, result);
  })
}

const mailboxId = '81b0055e-969d-4a0e-a9ad-21a9ded9c550';
const circlesMailboxId = [];
getLastMessageOfMailbox(mailboxId, (err, result) => {
  if (err) { return { message: 'err' } }
  //else { console.log(result.rows); }
})

getCirclesForMailbox(mailboxId, (err, result) => {
  if (err) { return { message: 'err' }; }
  const rows = result.rows;
  rows.forEach((x) => {
    const circles = x.circleid.toString();
    getMailboxIdForCircle(circles, (err, result) => {
      if (err) { return { message: 'err' }; }
      const rows = result.rows;
      rows.forEach((x) => {
        const mailboxes = x.mailboxid.toString();
        getLastMessageOfMailbox(mailboxes, (err, result) => {
          if (err) { return { message: 'err' } }
          else { console.log(result.rows); }
        })
      });
    });
  });
});

module.exports = { getCirclesForMailbox, getMailboxIdForCircle, getLastMessageOfMailbox };
