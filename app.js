const express = require('express');
require('dotenv').config();
require('express-async-errors');
const app = express();
const PORT = process.env.PORT;
const cookieParser = require("cookie-parser");

const { StatusCodes } = require('http-status-codes');
//DB연결

//바디
app.use(express.json());
app.use(cookieParser());

//라우터
const router = require("./routes/index.js");
app.use("/api",router);


app.use((error,req, res, next) => {
    res.status(error.status || StatusCodes.BAD_REQUEST).json({message: error.message})
});

app.listen(PORT, () => {
    console.log(PORT, "서버가 실행되었습니다.");
});

