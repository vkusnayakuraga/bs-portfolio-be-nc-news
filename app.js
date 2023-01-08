const express = require("express");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleVotesById,
} = require("./controllers/articles.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handle404PathErrors,
  handlePSQLErrors,
  handleCustomErrors,
  handle500Errors,
} = require("./controllers/errors.controllers");
const { getUsers } = require("./controllers/users.controllers");
const { deleteCommentById } = require("./controllers/comments.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleVotesById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deleteCommentById);

// Not covered endpoints
app.all("/*", handle404PathErrors);

// Error handling middleware
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;
