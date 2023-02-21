// no auth status code 401

const { verifyTokenUtils, config } = require("./config");

const getPostList = (req, res) => {
  const token = req.headers.authorization;
  verifyTokenUtils(token, res);
  config.query(
    `SELECT 
    POST.id,
    POST.title,
    POST.content,
    USER.email,
    CONCAT('[', IFNULL(GROUP_CONCAT(sorted_comment SEPARATOR ','), ''), ']') AS comment
  FROM (
    SELECT 
      JSON_OBJECT('author', USER.email, 'content', COMMENT.content) AS sorted_comment, 
      COMMENT.post_id,
      USER.id AS user_id
    FROM COMMENT 
    LEFT JOIN USER ON COMMENT.user_id = USER.id
    ORDER BY COMMENT.order_comment ASC
  ) AS sorted_comments
  RIGHT JOIN POST ON POST.user_id = sorted_comments.user_id
  LEFT JOIN USER ON USER.id = POST.user_id
  GROUP BY POST.id;
  
  `,
    (error, rows) => {
      if (error) throw error;
      console.log(rows);
      res.send({
        list: rows,
      });
    }
  );
};

module.exports = {
  getPostList,
};
