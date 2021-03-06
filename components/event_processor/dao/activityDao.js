const start = require('../client/dse');

const client = start.client;

function updateLastPublishedDate(mid, callback) {
  const query1 = (`select createdOn from circle where circleId = ${mid}`);
  client.execute(query1, (err, result) => {
    if (err) { callback(err, null); return; }
    const c = result.rows[0].createdon;
    const query = ('UPDATE circle SET lastPublishedActivity = ? where circleId=? and createdOn=?');
    client.execute(query, [new Date(), mid, c], (err1, result1) => {
      if (err1) { callback(err1, null); return; }
      callback(null, result1);
    });
  });
}

module.exports = {
  updateLastPublishedDate,
};
