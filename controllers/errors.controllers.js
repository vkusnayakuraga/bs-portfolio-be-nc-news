exports.handle404PathErrors = (req, res) => {
  res.status(404).send({ message: "This page does not exist!" });
};

// psql errors
exports.handlePSQLErrors = (err, req, res, next) => {
  if (["22P02", "23502"].includes(err.code)) {
    res.status(400).send({ message: "Bad request!" });
  } else if(err.code === "23503") {
    res.status(404).send({ message: "Not found!" });
  } else next(err);
};
// custom errors
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
};

exports.handle500Errors = (err, req, res, next) => {
  console.log(err, "<< Internal Server Error");
  res.status(500).send({ message: "Internal server error ;(" });
};
