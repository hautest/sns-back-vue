const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const config = require("./config");
const { signUp } = require("./user");

app.use(express.json());
app.use(cors());

app.listen(process.env.PORT);

app.post("/sign-up", signUp);
