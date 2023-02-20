// no auth status code 401

const { verifyTokenUtils, config } = require("./config");

const getPostList = (req, res) => {
  const token = req.headers.authorization;
  verifyTokenUtils(token, res);
  config.query("SELECT * FROM `POST` LIMIT 100;", (error, rows) => {
    if (error) throw error;
    res.send({
      list: rows,
    });
  });
};

module.exports = {
  getPostList,
};
