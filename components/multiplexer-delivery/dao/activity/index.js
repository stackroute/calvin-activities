const client = require('../../client/dseclient').client;

function publishToMailbox(mid, activity, callback) {
  const payload = JSON.stringify(activity.payload);
  const query = ('INSERT INTO activity (mailboxId,createdAt,activityId,payload) values( ?,?,?,? )');
  client.execute(query, [mid, new Date(Date.parse(activity.payload.createdAt)), activity.payload.id, payload], (err, result) => {
    if (err) { return callback(err); }
    return callback(err, activity);
  });
}

module.exports = {
  publishToMailbox,
};
