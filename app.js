const express = require("express");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
} = require("./controllers/articles.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { handlePSQLErrors, handleCustomErrors, handle500Errors } = require("./error-handlers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

// psql errors
app.use(handlePSQLErrors);
// custom errors
app.use(handleCustomErrors);
app.use(handle500Errors);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "This page does not exist!" });
});

module.exports = app;
