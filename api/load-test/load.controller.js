const circleDAO = require('../../dao').circle;

let interval = null;

function update(req, res) {
	msg = req.query.msg;
	n = req.query.n;
	circleDAO.getAllCircles(req.query.limit, (err, result) => {
    if (err) { res.status(500).json({ message: `${err}` }); return; }
    res.status(200).json({totalItems: result.a, items: result.b});
  });
  interval = setInterval(postMsgToCircle(msg, n, circlelist), 1000);
}

function postMsgToCircle(msg, n, circlelist)
{
	
}
module.exports = {
  update
};

