function follow(req, res) {
  // const { circleId, mailboxId } = req.params;

  // if (!mailboxDAO.checkIfMailboxExists(mailboxId, (err, id) => {
  //   if (err) { res.status(500).json({ message: `${err}` }); return; }
  //   res.status(404).json({ message: `Mailbox with id ${mailboxId} does not exist` });
  // })) {
  //   if (!circleDAO.checkIfCircleExists(circleId, (err, id) => {
  //     if (err) { res.status(500).json({ message: `${err}` }); return; }
  //     res.status(404).json({ message: `Circle with id ${circleId} does not exist` });
  //   })) {
  //     if (followDAO.checkIfFollowExists({ circleId, mailboxId })) {
  //       res.status(409).json({ message: `Mailbox ${mailboxId} is already following ${circleId}` });
  //       return;
  //     }
  //   }
  // }
  // const data=followDAO.addFollow({ circleId, mailboxId });
  // res.status(201).json(data);
}

function unfollow(req, res) {
  // const { circleId, mailboxId } = req.params;

  // if (!mailboxDAO.checkIfMailboxExists(mailboxId, (err, id) => {
  //   if (err) { res.status(500).json({ message: `${err}` }); return; }
  //   res.status(404).json({ message: `Mailbox with id ${mailboxId} does not exist` });
  // })) {
  //   if (!circleDAO.checkIfCircleExists(circleId)) {
  //     res.status(404).json({ message: `Circle with id ${circleId} does not exist` });
  //     return;
  //   }
  // }

  // {
  //   if (!circleDAO.checkIfCircleExists(circleId, (err, id) => {
  //     if (err) { res.status(500).json({ message: `${err}` }); return; }
  //     res.status(404).json({ message: `Circle with id ${circleId} does not exist` });
  //   })) {
  //     if (!followDAO.checkIfFollowExists({ circleId, mailboxId })) {
  //       res.status(404).json({ message: 'Link does not exists' });
  //       return;
  //     }
  //   }
  // }
  // const result = followDAO.deleteFollow({ circleId, mailboxId });
  // res.status(200).json(result);
}

module.exports = {
  follow, unfollow,
};
