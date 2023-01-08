const db = require("../db/connection");

exports.selectTopics = () => {
  return db
    .query("SELECT slug, description FROM topics;")
    .then(({ rows: topics }) => {
      return topics;
    });
};

exports.selectTopicBySlug = (querySlug = "") => {
  return db
    .query("SELECT * from topics WHERE slug = $1;", [querySlug])
    .then(({ rows: topic, rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "This topic does not exist!",
        });
      }
      return topic;
    });
};
