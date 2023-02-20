const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const config = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: "SNS_BY_VUE",
});

module.exports = {
  config,
};
