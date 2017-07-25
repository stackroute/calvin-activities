const adapterDAO = require('../../../dao/cassandra/adapter');
const followDAO = require('../../../dao/cassandra/follow');

function addFollow(req, res) {
  adapterDAO.checkIfDomainExists(req.params.domain, (error, doesDomainExists) => {
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesDomainExists) {
      res.status(404).json({ message: 'Domain does not exist' });
      return;
    }
    adapterDAO.checkIfUserExists(req.params.user, (error1, doesUserExists) => {
      if (error1) { res.status(500).json({ message: `${error1}` }); return; }
      if (!doesUserExists) {
        res.status(404).json({ message: 'User does not exist' });
        return;
      }
      const obj = {
        circleId: (doesDomainExists.circleid).toString(),
        mailboxId: (doesUserExists.mailboxid).toString(),
      };
      const startFollowing = new Date();
      followDAO.addFollow(obj, startFollowing, (error2, addfollower) => {
        if (error2) { res.status(500).json({ message: `${error2}` }); return; }
        const msg = {
          domain : req.params.domain,
          user : req.params.user,
        }
        res.status(201).json(msg);
      });
    });
  });
}


function deleteFollow(req, res) {
  adapterDAO.checkIfDomainExists(req.params.domain, (error, doesDomainExists) => {
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesDomainExists) {
      res.status(404).json({ message: 'Domain does not exist' });
      return;
    }

    adapterDAO.checkIfUserExists(req.params.user, (error1, doesUserExists) => {
      if (error1) { res.status(500).json({ message: `${error1}` }); return; }
      if (!doesUserExists) {
        res.status(404).json({ message: 'User does not exist' });
        return;
      }

      const obj = {
        circleId: (doesDomainExists.circleid).toString(),
        mailboxId: (doesUserExists.mailboxid).toString(),
      }
      followDAO.checkIfFollowExists(obj, (error, doesFollowExists) => {
        if (error) { res.status(500).json({ message: `${error}` }); return; }
        if(!doesFollowExists){
          res.status(404).json({ message: `Link does not exists` }); return;
        }
        followDAO.deleteFollow(obj, (err, result) => {
          if (err) { res.status(500).json({ message: ` ${err}` }); return; }
          res.status(200).json({ message: 'follow deleted' });
        });
      });
    });
  });
}


module.exports = { addFollow, deleteFollow };
