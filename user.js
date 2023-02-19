const config = require("./config");
require("dotenv").config();

const EMAIL_REGEX =
  /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
const isEmail = new RegExp(EMAIL_REGEX);

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const isPassword = new RegExp(PASSWORD_REGEX);

module.exports.signUp = (res, req) => {
  const { email, password, rePassword } = res.body;
  if (!email.length || !password.length || !rePassword.length) {
    req.status(404).send({
      message: "값을 입력해주십시오.",
      isSuccess: 0,
    });
  }
  if (!isEmail.test(email)) {
    req.status(404).send({
      message: "Email 양식이 아닙니다.",
      isSuccess: 0,
    });
  }
  if (!isPassword.test(password)) {
    req.status(404).send({
      message: "비밀번호 양식이 아닙니다.",
      isSuccess: 0,
    });
  }
  if (password !== rePassword) {
    req.status(404).send({
      message: "비밀번호가 일치하지 않습니다.",
      isSuccess: 0,
    });
  }
  config.query(`SELECT * from USER WHERE email='${email}'`, (error, rows) => {
    if (error) throw error;
    if (!rows.length) return;
    req.status(404).send({
      message: "이미 있는 계정입니다.",
      isSuccess: 0,
    });
  });

  config.query(
    `INSERT INTO USER (email, password, createdAt)
          VALUES ('${email}', '${password}', NOW());`,
    (error, rows) => {
      if (error) throw error;
      req.send({ isSuccess: 1 });
    }
  );
};

const jwt = require("jsonwebtoken");
module.exports.signIn = (req, res) => {
  const { email, password } = req.body;
  config.query(`SELECT * FROM USER WHERE email = '${email}'`, (error, rows) => {
    if (error) throw error;
    if (!rows.length) {
      res.status(404).send({
        isSuccess: 0,
        message: "없는 계정입니다.",
      });
    }
    const { password: passwordInDB } = rows[0];
    if (passwordInDB !== password) {
      res.status(404).send({
        isSuccess: 0,
        message: "비밀번호가 일치하지 않습니다.",
      });
    }

    const token = jwt.sign(
      {
        email,
        password,
      },
      process.env.SECRET,
      {
        expiresIn: "15m",
      }
    );
    res.send({
      isSuccess: 1,
      token,
    });
  });
};
