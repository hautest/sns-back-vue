const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const { signUp, signIn, verify } = require("./user");
const { getPostList, createPost } = require("./post");

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT);

app.post("/verify", verify);

// 회원가입
app.post("/sign-up", signUp);
// 로그인
app.post("/sign-in", signIn);

//게시물 목록
app.get("/post/list", getPostList);

//게시물 생성
app.post("/post/create", createPost);
