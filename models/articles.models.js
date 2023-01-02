const format = require("pg-format");
const db = require("../db/connection");

exports.selectArticles = (topic) => {
  const queryParams = [];

  let queryString = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  `;

  if (topic) {
    queryString += `WHERE articles.topic ILIKE $1`;
    queryParams.push(topic);
  }

  queryString += `
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;

  return db.query(queryString, queryParams).then(({ rows: articles }) => {
    return articles;
  });
};

exports.selectArticleById = (article_id) => {
  const queryString = `
  SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, COUNT(comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;`;
  return db
    .query(queryString, [article_id])
    .then(({ rows: [article], rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "This article id does not exist!",
        });
      }
      return article;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  const queryString = `
  SELECT comments.comment_id, comments.votes, comments.created_at,  comments.author,  comments.body
  FROM comments
  WHERE comments.article_id = $1
  ORDER BY comments.created_at DESC;`;
  return db.query(queryString, [article_id]).then(({ rows: comments }) => {
    return comments;
  });
};

exports.insertCommentByArticleId = (article_id, body, username) => {
  const commentValues = [body, username, +article_id, 0];
  const insertCommentQueryString = format(
    `INSERT INTO comments
    (body, author, article_id, votes)
    VALUES
    (%L)
    RETURNING *;`,
    commentValues
  );
  return db.query(insertCommentQueryString).then(({ rows: [comment] }) => {
    return comment;
  });
};

exports.updateArticleVotesById = (article_id, inc_votes) => {
  const queryString = `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING author, title, article_id, body, topic, created_at, votes;`;
  return db
    .query(queryString, [inc_votes, article_id])
    .then(({ rows: [article] }) => {
      return article;
    });
};
