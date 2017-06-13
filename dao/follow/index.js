const followapi = [];

function addFollow(circleId,mailboxId){
 const newuser = {
    circleId:circleId,
    mailboxId:mailboxId,
  };
followapi.push(newuser);
return newuser;  
}
function checkIfFollowExists(circleId,mailboxId){
const filter = followapi.filter(y => y.circleId === circleId && y.mailboxId === mailboxId);
if (filter.length === 0) {
    return false;
  }
return true;
}
function deleteFollow(circleId,mailboxId)
{
  const filter = followapi.filter(y => y.circleId === circleId && y.mailboxId === mailboxId); 
  followapi.splice(followapi.indexOf(filter[0]), 1);
  return filter[0];
}
module.exports = {
    deleteFollow,
    addFollow,
    checkIfFollowExists,
}
