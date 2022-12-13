const express = require("express");
const {
  getArticles,
  getArticleById,
} = require("./controllers/articles.controllers");
const { getTopics } = require("./controllers/topics.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

// psql errors
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "bad request" });
  } else next(err);
});
// custom errors
app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
});

app.all("/*", (req, res) => {
  res.status(404).send({ message: "This page does not exist!" });
});

module.exports = app;
