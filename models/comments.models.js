const db = require("../db/connection");

exports.removeCommentById = (comment_id) => {
  const queryString = `
  DELETE FROM comments
  WHERE comment_id = $1;`;
  return db.query(queryString, [comment_id]).then(({ rowCount }) => {
    if (!rowCount) {
      return Promise.reject({
        status: 404,
        message: "This comment id does not exist!",
      });
    }
  });
};
