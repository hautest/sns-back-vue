const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const { signUp, signIn, verify } = require("./user");
const { getPostList } = require("./post");

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT);

app.post("/verify", verify);

// 회원가입
app.post("/sign-up", signUp);
// 로그인
app.post("/sign-in", signIn);

app.get("/post/list", getPostList);
