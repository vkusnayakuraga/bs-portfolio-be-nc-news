// psql errors
exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request!" });
  } else next(err);
};
// custom errors
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
};

exports.handle500Errors = (err, req, res, next) => {
  console.log(err, "<< Internal Server Error");
  if (err.status && err.message) {
    res.status(500).send({ message: "Internal server error ;(" });
  }
};
