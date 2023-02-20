// no auth status code 401

const { verifyToken } = require("./config");

const getPostList = (req, res) => {
  const token = req.headers.authorization;
  verifyToken(token);
};

module.exports = {
  getPostList,
};
