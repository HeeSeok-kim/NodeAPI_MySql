const express = require('express');
const router = express.Router();

const user = require("./user.js");
const post = require("./post.js");
const comment = require("./comment.js");

router.use("/user",user);
router.use("/post",post);
router.use("/comments",comment);

module.exports = router;