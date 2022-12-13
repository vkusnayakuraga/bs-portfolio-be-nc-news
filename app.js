const express = require("express");
const { getArticles } = require("./controllers/articles.controllers");
const { getTopics } = require("./controllers/topics.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.all("/*", (req, res) => {
  res.status(404).send({ message: "This page does not exist!" });
});

module.exports = app;