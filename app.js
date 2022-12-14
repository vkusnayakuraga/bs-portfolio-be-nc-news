const express = require("express");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
} = require("./controllers/articles.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handle404PathErrors,
  handlePSQLErrors,
  handleCustomErrors,
  handle500Errors,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

// Not covered endpoints
app.all("/*", handle404PathErrors);

// Error handling middleware
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
