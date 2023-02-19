const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const config = require("./config");
const { signUp, signIn } = require("./user");

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT);

// 회원가입
app.post("/sign-up", signUp);
// 로그인
app.post("/sign-in", signIn);
