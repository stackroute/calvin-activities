const client = require('../../client/dseclient').client;


function publishToMailbox(mid, activity, callback) {
  console.log('inside activity');
  const payload = JSON.stringify(activity.payload);
  
  const query = ('INSERT INTO activity (mailboxId,createdAt,payload) values( ?,?,? )');
  client.execute(query, [mid, activity.timestamp, payload], (err, result) => {
  	if (err) { return callback(err); }
    return callback(err, activity);
  });
}

module.exports = {
  publishToMailbox,
};
