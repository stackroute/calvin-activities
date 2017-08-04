const client = require('../../client/dseclient').client;
let in_count = 0;
let out_count = 0;

function publishToMailbox(mid, activity, callback) {
  const payload = JSON.stringify(activity.payload);
  const query = ('INSERT INTO activity (mailboxId,createdAt,payload) values( ?,?,? )');
  console.log('in_count-' + (in_count++) + ' - time - ' + activity.timestamp);
  client.execute(query, [mid, activity.timestamp, payload], (err, result) => {
  	if (err) { return callback(err); }
    console.log('out_count-' + out_count++);
    return callback(err, activity);
  });
}

module.exports = {
  publishToMailbox,
};
