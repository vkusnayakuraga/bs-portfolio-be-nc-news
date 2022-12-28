const db = require("../db/connection");

exports.selectUsers = () => {
  const queryString = `
  SELECT username, name, avatar_url
  FROM users;`;
  return db.query(queryString).then(({ rows: users }) => {
    return users;
  });
}