const endpoints = require("../endpoints.json");

exports.getAPIEndpoints = (req, res) => {
  res.status(200).send(endpoints);
};
