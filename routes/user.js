const express = require("express");
const router = express.Router();
require('dotenv').config();
//에러 핸들러
const errorApi = require("../error/errorApi");
const StatusCodes = require('http-status-codes');
const errorMessage = require('../error/errormessage.js');
//DB
const {Users} = require('../models')
const { Op } = require("sequelize");
//jwt토큰
const {createAccessToken,jwtVerify} = require("../util/jwtToken.js");
//암호화
const {encrypt} = require("../util/crypto/aes256");

const {common,userError} = errorMessage
const {BAD_REQUEST,PRECONDITION_FAILED,FORBIDDEN,OK} = StatusCodes;

router.post("/signup",async (req,res,next) => {
    try{
        const { nickname, password, confirm } = req.body;

        if(!nickname || !password || !confirm){
            errorApi(common.invalidDataRequest,BAD_REQUEST);
        }

        if(password !== confirm){
            errorApi(userError.invalidPw,PRECONDITION_FAILED);
        }

        if(nickname.search(/[A-Za-z0-9]{2}\w/g) === -1){
            errorApi(userError.invalidIdForm,PRECONDITION_FAILED)
        }

        if(password.length < 4){
            errorApi(userError.invalidPwForm,PRECONDITION_FAILED)
        }

        if(password.indexOf(nickname) > -1){
            errorApi(userError.includeId,PRECONDITION_FAILED);
        }
        let existsUsers = "";

        existsUsers = await Users.findAll({
            where: {
                [Op.or]: [{ nickname }],
            },
        });

        if(existsUsers.length){
            errorApi(userError.overlapId,PRECONDITION_FAILED);
        }
        const cryptPw = encrypt(password);
        await Users.create({nickname, password:cryptPw});
        res.status(OK).json({  "message": "회원 가입에 성공하였습니다."});

    }catch (e){
        if(e.name === 'errorApi'){
            throw e
        }else {
            errorApi(common.invalidDataRequest,BAD_REQUEST);
        }
    }
});

router.post("/login",async(req,res,next) => {
    try {
        const { nickname, password } = req.body;
        const {token} = req.cookies;

        if(token){
            errorApi(userError.loginError,FORBIDDEN);
        }

        const user = await Users.findOne({
            where: {
                nickname
            },
        });

        if(!user || user.password !== encrypt(password)){
            errorApi(userError.invalidUser)
        }
        const createToken = createAccessToken(user.userId);
        res.cookie("token",createToken);
        res.status(OK).json({"token":createToken});
    }catch (e){
        if(e.name === 'errorApi'){
            throw e
        }else {
            errorApi(common.invalidDataRequest,BAD_REQUEST);
        }
    }

});


module.exports = router;