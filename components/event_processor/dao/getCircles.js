const start=require('../client/dse');

const client=start.client;

function getCirclesForMailbox(mailboxId, callback) {
  const query = (`SELECT  circleid from circlesfollowedbymailbox where mailboxId = ${mailboxId}`);
  client.execute(query, (err, result) => {
    if (err) { throw err; }
    // console.log(result);
    return callback(err, result);
  });
}
function getMailboxIdForCircle(circleId,callback){
  const query = (`SELECT mailboxid from circle where circleid = ${circleId}`);
  client.execute(query,(err,result) => {
    if(err) {throw err ;}
    return callback(err,result);
  })
}
module.exports = { getCirclesForMailbox,getMailboxIdForCircle };
