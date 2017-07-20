const followDao = require('../follow');
const kafkaClient = require('../../../kafka');
const start = require('../../../db');
const config = require('../../../config');
const createdAt = new Date();

const listeners = {};

const client = start.client;

function publishActivityToListeners(mid, activity) {
  if (!listeners[mid]) { return; }
  listeners[mid].forEach((socket) => {
    socket.emit('newActivity', activity);
  });
}
function publishToMailbox(mid, activity, callback) {
  const payload = JSON.stringify(activity.payload);
  const query = ('INSERT INTO activity (mailboxId,createdAt,payload) values( ?,?,? )');
  client.execute(query, [mid, activity.timestamp, payload], (err, result) => {
    console.log('result in publishToMailbox=>'result);
    if (err) { return callback(err); }
    return callback(err, activity);
  });
}

function createPublishActivity(mid, activity, callback) {
  const msg = JSON.parse(JSON.stringify(activity));
  activity.circleId = mid;
  kafkaClient.addActivity(activity, (err, data) => {
    if (err) {console.log('err:', err); return callback(err, null); }
    console.log('data:', data);
    const query1 = (`select createdOn from circle where circleId = ${mid}`);
    client.execute(query1, (err, result) => {
      if (err) { return callback(err, null); }
      const c = result.rows[0].createdon;
      const query = ('UPDATE circle SET lastPublishedActivity = ? where circleId=? and createdOn=?');
      client.execute(query, [new Date(), mid, c], (err, result) => {
        if (err) { return callback(err, null); }
        callback(null, msg);
      });
    });
  });
}

function checkIfMailboxExists(mid, callback) {
  const query = (`SELECT * from activity where mailboxId= ${mid}`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(err, result.rowLength > 0);
  });
}

function retriveMessageFromMailbox(mid, before, after, limit, callback) {
  checkIfMailboxExists(mid, (err, MailIdExists) => {
    if (err) { return callback(err, null); }
    if(!MailIdExists) { return callback(null, { a : 0, b : []});};
    if (MailIdExists && limit != 0) {

      //limit -1
       if (limit == -1 && before != undefined && after == undefined) {
        const query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < '${before}'`);
        client.execute(query, (err1, result) => {
          if (err1) { return callback(err1); }
          let a = result.rows.length;
          let b = result.rows;
          return callback(null, { a, b });
        });
      }
      else if (limit == -1 && after != undefined && before == undefined) {
        const query = (`SELECT * from activity where mailboxId= ${mid} and createdAt > '${after}'`);
        client.execute(query, (err1, result) => {
          if (err1) { return callback(err1); }
          let a = result.rows.length;
          let b = result.rows;
          return callback(null, { a, b });
        });
        return;
      }

      else if (limit == -1 && after != undefined && before != undefined) {
     
        const query = (`SELECT * from activity where mailboxId= ${mid} and createdAt > '${after}' and createdAt < '${before}'`);
        client.execute(query, (err1, result) => {
          if (err1) { return callback(err1); }
          let a = result.rows.length;
          let b = result.rows;
          return callback(null, { a, b });
          return;
        });
      }

 else if (limit == -1 && after == undefined && before == undefined) {
    const query = (`SELECT * from activity where mailboxId= ${mid}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, { a, b });
    });
  }

  // limit undefined

  else if (limit == undefined && before != undefined && after == undefined) {

    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < '${before}' limit ${defaultLimit}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, { a, b });
    });
  }

  else if (limit == undefined && after != undefined && before == undefined) {

    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from activity where mailboxId = ${mid} and createdAt > '${after}' limit ${defaultLimit}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, { a, b });
    });
  }

 else if (limit == undefined && after != undefined && before != undefined) {

    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < '${before}' and createdAt > '${after}' limit ${defaultLimit}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, { a, b });
    });
  }

 else if (limit == undefined && after == undefined && before == undefined) {

    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from activity where mailboxId = ${mid} limit ${defaultLimit}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, { a, b });
    });
  }


// limit is defined


  else if (limit != undefined && before != undefined && after == undefined) {
    const query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < '${before}' limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, { a, b });
    });
  }

  else if (limit != undefined && after != undefined && before == undefined) {

    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from activity where mailboxId = ${mid} and createdAt > '${after}' limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, { a, b });
    });
  }

 else if (limit != undefined && after != undefined && before != undefined) {

    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from activity where mailboxId = ${mid} and createdAt < '${before}' and createdAt > '${after}' limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, { a, b });
    });
  }

 else if (limit != undefined && after == undefined && before == undefined) {

    const defaultLimit = config.defaultLimit;
    const query = (`SELECT * from activity where mailboxId = ${mid} limit ${limit}`);
    client.execute(query, (error, result) => {
      if (error) { return callback(error, null); }
      let a = result.rows.length;
      let b = result.rows;
      return callback(null, { a, b });
    });
  }

    }
    else { return callback("limit is 0"); }
  });
}

function addListnerToMailbox(mid, socket) {
  if (!listeners[mid]) { listeners[mid] = []; }
  listeners[mid].unshift(socket);
}

function removeListnerFromMailbox(mid, socket) {
  const index = listeners[mid].indexOf(socket);
  listeners[mid].splice(index, 1);
}


function checkActivityPublished(mid, callback) {
  const query = (`SELECT * from activity where mailboxId= ${mid}`);
  client.execute(query, (err, result) => {
    if (err) { return callback(err); }
    return callback(null, result.rows);
  });
}

module.exports = {
  publishToMailbox,
  addListnerToMailbox,
  createPublishActivity,
  removeListnerFromMailbox,
  retriveMessageFromMailbox,
  checkActivityPublished,
  publishActivityToListeners,
  listeners,
};
