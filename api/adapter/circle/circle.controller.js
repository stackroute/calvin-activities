
const adapterDAO = require('../../../dao/cassandra/adapter');


function createDomain(req, res) {
  const newdomain = req.params.domain;
  adapterDAO.createDomain(newdomain, (err, domain) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(201).json({ domain });
  });
}

function deleteDomain(req, res) {
  adapterDAO.checkIfDomainExists(req.params.domain, (error, doesDomainExists) => {
    //console.log(doesDomainExists);
    if (error) { res.status(500).json({ message: `${error}` }); return; }
    if (!doesDomainExists) {
      res.status(404).json({ message: 'Domain does not exist' });
      return;
    }
    adapterDAO.deleteDomain(req.params.domain, (err, deletedDomain) => {
      if (err) { res.status(500).json({ message: `${err}` }); return; }
      res.status(200).json(deletedDomain);
    });
  });
}


module.exports = {
  createDomain, deleteDomain,
};
