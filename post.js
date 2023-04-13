// no auth status code 401

const { verifyTokenUtils, config } = require("./config");

const getPostList = (req, res) => {
  const token = req.headers.authorization;
  verifyTokenUtils(token, res);
  config.query(
    `
    SELECT POST.id, content, POST.createdAt, email 
    FROM POST
    JOIN USER ON POST.user_id = USER.id
    LIMIT 100;
    `,
    (error, rows) => {
      if (error) throw error;
      handleSetComment(rows);
    }
  );

  const handleSetComment = (rowsData) => {
    const promises = rowsData.map((item) => {
      return new Promise((resolve, reject) => {
        config.query(
          `
          SELECT 
  USER.email,
  COMMENT.content,
  COMMENT.order_comment
FROM COMMENT
LEFT JOIN USER ON COMMENT.user_id = USER.id
WHERE COMMENT.post_id = ${item.id}
ORDER BY COMMENT.order_comment
LIMIT 100
          `,
          (error, rows) => {
            if (error) reject(error);
            item.comment = rows;
            resolve();
          }
        );
      });
    });

    Promise.all(promises)
      .then(() => {
        console.log(rowsData[0]);
        res.send({
          list: rowsData,
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Internal Server Error");
      });
  };
};

const createPost = (req, res) => {
  const token = req.headers.authorization;
  console.log(req);
  verifyTokenUtils(token, res);
  const { title, content } = req.body;
  config.query(
    `INSERT INTO POST (title, content, user_id) VALUES ('${title}', '${content}', 1);`,
    (error, rows) => {
      if (error) throw error;
      res.send({
        isSuccess: 1,
      });
    }
  );
};

module.exports = {
  getPostList,
  createPost,
};

// `SELECT
//   POST.id,
//   POST.title,
//   POST.content,
//   USER.email,
//   CONCAT('[', IFNULL(GROUP_CONCAT(sorted_comment SEPARATOR ','), ''), ']') AS comment
// FROM (
//   SELECT
//     JSON_OBJECT('author', USER.email, 'content', COMMENT.content) AS sorted_comment,
//     COMMENT.post_id,
//     USER.id AS user_id
//   FROM COMMENT
//   LEFT JOIN USER ON COMMENT.user_id = USER.id
//   ORDER BY COMMENT.order_comment ASC
// ) AS sorted_comments
// RIGHT JOIN POST ON POST.user_id = sorted_comments.user_id
// LEFT JOIN USER ON USER.id = POST.user_id
// GROUP BY POST.id;
// `,
//   `SELECT
//   POST.id,
//   POST.title,
//   POST.content,
//   USER.email,
//   CONCAT('[', IFNULL(GROUP_CONCAT(sorted_comment SEPARATOR ','), ''), ']') AS comment
// FROM (
//   SELECT
//     JSON_OBJECT('author', USER.email, 'content', COMMENT.content) AS sorted_comment,
//     COMMENT.post_id,
//     USER.id AS user_id
//   FROM COMMENT
//   LEFT JOIN USER ON COMMENT.user_id = USER.id
//   ORDER BY COMMENT.order_comment ASC
// ) AS sorted_comments
// RIGHT JOIN POST ON POST.user_id = sorted_comments.user_id
// LEFT JOIN USER ON USER.id = POST.user_id
// WHERE POST.id = sorted_comments.post_id
// GROUP BY POST.id;
// `,
