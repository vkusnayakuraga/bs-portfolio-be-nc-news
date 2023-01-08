const { removeCommentById } = require("../models/comments.models");

exports.deleteCommentById = (req, res, next) => {
  const comment_id = req.params.comment_id;
  removeCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
