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
  });
}

function getLastMessageOfMailbox(mailboxId, callback) {
  const query = (`SELECT createdat from activity where mailboxid = ${mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { throw err; }
    if (result.rowLength === 0) { return callback(null); }
    return callback(err, result.rows[0].createdat);
  });
}

function convertArrayToQueryParam(array) {
  let query = '(';
  for (let i = 0; i < array.length; i += 1) {
    query += `${array[i]},`;
  }

  let result = query.substring(0, query.length - 1);
  result += ')';
  return result;
}

function getAllActivitiesFromGivenTime(circlesMailboxesArray, lastActivityTime, callback) {
  const circleMailboxes = convertArrayToQueryParam(circlesMailboxesArray);
  const query = (`SELECT * from activity where mailboxid in ${circleMailboxes} and createdAt > '${lastActivityTime}'`);

  const activities = [];
  let activitiesCount = 0;
  const options = { fetchSize: 100 };
  client.eachRow(query, [], options, (n, row) => {
    activities.push(row);
    activitiesCount += 1;
  }, (err, result) => {
    if (result.nextPage) {
      console.log(`next - ${activitiesCount} - ${activities.length}`);
      result.nextPage();
    } else {
      callback(null, activities);
    }
  });
}

function insertActivitiesForMailbox(mailboxId, activities, callback) {
  const insertQuery = '';
  for (let i = 0; i < activities.length; i += 1) {
    const query = ('INSERT INTO activity (mailboxId,createdat,activityid,payload) values( ?,?,?,? )');
    client.execute(query, [mailboxId, activities[i].createdat, activities[i].activityid, activities[i].payload], (err, result) => {
      if (err) { console.log(err); callback(err); }
    });
  }
}

function getCircleIdsForMailbox(mailboxId, callback) {
  const query = (`SELECT  circleid from circlesfollowedbymailbox where mailboxId = ${mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { throw err; }
    const circleIds = result.rows.map(a => a.circleid.toString());
    return callback(err, circleIds);
  });
}

function getAllCirclesMailboxIds(circleIds, callback) {
  const circles = convertArrayToQueryParam(circleIds);
  const query = (`SELECT mailboxid from circle where circleid in ${circles}`);
  client.execute(query, (err, result) => {
    if (err) { throw err; }
    const circlesMailboxes = result.rows.map(a => a.mailboxid.toString());
    return callback(err, circlesMailboxes);
  });
}

function syncMailbox(mailboxId, callback) {
  getCircleIdsForMailbox(mailboxId, (err, data) => {
    if (err) { console.log(err); callback(err); return; }
    if (data && data.length > 0) {
      getAllCirclesMailboxIds(data, (err1, circlesMailboxes) => {
        if (err1) { console.log(err1); callback(err1); return; }
        getLastMessageOfMailbox(mailboxId, (err2, lastSavedActivity) => {
          let getUserActivitiesFrom = lastSavedActivity;
          if (err2) { console.log(err2); callback(err2); return; }
          if (lastSavedActivity === null || lastSavedActivity === undefined) { getUserActivitiesFrom = '2017-01-01T00:00:00.000Z'; } else {
            const dateT = `${lastSavedActivity.getFullYear()}-${lastSavedActivity.getMonth()}-${lastSavedActivity.getDate()}T${lastSavedActivity.getHours()}:${lastSavedActivity.getMinutes()}:${lastSavedActivity.getSeconds()}.000Z`;
            getUserActivitiesFrom = dateT;
          }
          getAllActivitiesFromGivenTime(circlesMailboxes, getUserActivitiesFrom, (err4, activities) => {
            if (err4) { console.log(err4); callback(err4); return; }
            if (activities === null || activities === undefined) { callback(null); return; }
            insertActivitiesForMailbox(mailboxId, activities, (err5, result) => {
              if (err5) { console.log(err5); callback(err5); }
            });
          });
        });
      });
    }
  });
}

module.exports = { getCirclesForMailbox, getMailboxIdForCircle, getLastMessageOfMailbox, syncMailbox };
