const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const config = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: "SNS_BY_VUE",
});

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return "tokenExpired";
    } else {
      return "invalidToken";
    }
  }
};

const verifyTokenUtils = (token, res) => {
  const result = verifyToken(token);
  if (result === "invalidToken" || result === "tokenExpired")
    res.status(401).send({
      isSuccess: 0,
      message: result,
    });
};

module.exports = {
  config,
  verifyToken,
  verifyTokenUtils,
};
