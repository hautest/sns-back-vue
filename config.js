var mysql = require("mysql");

module.exports = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: "SNS_BY_VUE",
});
