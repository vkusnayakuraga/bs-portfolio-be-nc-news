const db = require("../db/connection");

exports.selectArticles = () => {
  const selectArticlesQuery = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comment_id)::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;
  return db.query(selectArticlesQuery).then(({ rows: articles }) => {
    return articles;
  });
};

exports.selectArticleById = (article_id) => {
  const queryString = `
  SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes
  FROM articles
  WHERE articles.article_id = $1;`;
  return db
    .query(queryString, [article_id])
    .then(({ rows: [articles], rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({
          status: 404,
          message: "This article id does not exist!",
        });
      }
      return articles;
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
