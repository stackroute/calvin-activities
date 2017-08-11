const client = require('../../client/dseclient').client;
let in_count = 0;
let out_count = 0;

function publishToMailbox(mid, activity, callback) {
  const payload = JSON.stringify(activity.payload);
  const query = ('INSERT INTO activity (mailboxId,createdAt,activityId,payload) values( ?,?,?,? )');
  console.log('in_count-' + (in_count++) + ' - time - ' + activity.payload.createdAt);
  client.execute(query, [mid, new Date(Date.parse(activity.payload.createdAt)), activity.payload.id, payload], (err, result) => {
  	if (err) { return callback(err); }
    console.log('out_count-' + out_count++);
    return callback(err, activity);
  });
}

module.exports = {
  publishToMailbox,
};
