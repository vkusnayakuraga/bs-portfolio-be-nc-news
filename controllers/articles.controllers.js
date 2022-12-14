const {
  selectArticles,
  selectArticleById,
  selectCommentsByArticleId,
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
