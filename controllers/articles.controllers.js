const {
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const promises = [
    selectCommentsByArticleId(article_id),
    selectArticleById(article_id),
  ];
  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const { username, body } = req.body;
  const promises = [
    selectArticleById(article_id),
    insertCommentByArticleId(article_id, body, username)
  ];
  Promise.all(promises)
    .then(([,comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
