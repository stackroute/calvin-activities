const start = require('../client/dse');

const client = start.client;

function getCirclesForMailbox(mailboxId, callback) {
  const query = (`SELECT  circleid from circlesfollowedbymailbox where mailboxId = ${mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { throw err; }
    console.log(result);
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
  const query = (`SELECT createdat from activity where mailboxid = ${mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { throw err; }
    if (result.rowLength == 0) { return callback(null); }
    return callback(err, result.rows[0].createdat);
  })
}

function getAllActivitiesFromGivenTime(circlesMailboxesArray, lastActivityTime, callback) {
  console.log(lastActivityTime);
  const circleMailboxes = convertArrayToQueryParam(circlesMailboxesArray);
  const query = (`SELECT * from activity where mailboxid in ${circleMailboxes} and createdat < (?)`);
  console.log(query);
  client.execute(query, [lastActivityTime], (err, result) => {
    if (err) { return callback(err); }
    if (result.rowLength == 0) { return callback(null); }
    return callback(err, result.rows);
  });
}

function insertActivitiesForMailbox(mailboxId, activities, callback) {
  let insertQuery = "";
  for (let i = 0; i < activities.length; i += 1) {
    console.log(activities[i]);
    const query = ('INSERT INTO activity (mailboxId,createdat,payload) values( ?,?,? )');
    client.execute(query, [mailboxId, activities[i].createdat, activities[i].payload], (err, result) => {
      console.log(err);
      if (err) { return callback(err); }
    });
  }
}

function syncMailbox(mailboxId, callback) {
  getCircleIdsForMailbox(mailboxId, function (err, data) {
    getAllCirclesMailboxIds(data, function (err, circlesMailboxes) {
      getLastMessageOfMailbox(mailboxId, function (err, lastSavedActivity) {
        if (lastSavedActivity == null) { lastSavedActivity = new Date('2017-01-01'); }
        getAllActivitiesFromGivenTime(circlesMailboxes, lastSavedActivity, function (err, activities) {
          if (err) { return callback(err); }
          if (activities == null) { return callback(null); }
          insertActivitiesForMailbox(mailboxId, activities, function (err, result) {
            if (err) { return callback(err); }
          })
        })
      })
    })
  })
}


function getCircleIdsForMailbox(mailboxId, callback) {
  const query = (`SELECT  circleid from circlesfollowedbymailbox where mailboxId = ${mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { throw err; }
    let circleIds = result.rows.map(function (a) { return a.circleid.toString(); })
    return callback(err, circleIds);
  });
}

function getAllCirclesMailboxIds(circleIds, callback) {
  const circles = convertArrayToQueryParam(circleIds);
  const query = (`SELECT mailboxid from circle where circleid in ${circles}`);
  client.execute(query, (err, result) => {
    if (err) { throw err; }
    let circlesMailboxes = result.rows.map(function (a) { return a.mailboxid.toString(); });
    return callback(err, circlesMailboxes);
  })
}



function convertArrayToQueryParam(array) {
  let query = '(';
  for (let i = 0; i < array.length; i += 1) {
    query += array[i] + ',';
  }

  let result = query.substring(0, query.length - 1);
  result += ')';
  return result;
}

module.exports = { getCirclesForMailbox, getMailboxIdForCircle, getLastMessageOfMailbox, syncMailbox };
