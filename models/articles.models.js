const db = require("../db/connection");

exports.selectArticles = () => {
  const selectArticlesQuery = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id;
  `;
  return db.query(selectArticlesQuery).then(({ rows: articles }) => {
    return articles;
  });
};