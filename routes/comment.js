const express = require("express");
const router = express.Router();
//에러 핸들러
const errorApi = require("../error/errorApi");
const StatusCodes = require('http-status-codes');
const errorMessage = require('../error/errormessage.js');
//로그인 검증
const {jwtVerify} = require("../util/jwtToken.js");
//DB
const {Posts,Users,Comments} = require("../models");
const {where} = require("sequelize");
const {common,commentError} = errorMessage;
const {BAD_REQUEST,OK,PRECONDITION_FAILED,UNAUTHORIZED,NOT_FOUND} = StatusCodes;

router.post("/:postId",jwtVerify,async (req,res,next) => {
    const {postId} = req.params;
    const userId = res.locals.userId;
    const {comment} = req.body;
    if(!comment){
        errorApi(common.invalidDataType,PRECONDITION_FAILED);
    }
    //게시글 조회
    try{
        let post = await Posts.findAndCountAll({
            where: {"postId":postId},
        });
        if(!post.count){
            errorApi(commentError.createdNotComment,BAD_REQUEST)
        }
        await Comments.create({"postId":postId,"userId":userId,"content":comment})
        res.status(OK).json({  "message": "댓글을 작성하였습니다."});
    }catch (error){
        errorApi(commentError.createdNotComment,BAD_REQUEST)
    }
});

router.get("/:postId",jwtVerify,async (req,res,next) => {
    try{
        const {postId} = req.params;

        let comments = await Comments.findAll({
            where: {"postId":postId},
            include:[{
                model:Users,
                attributes:['nickname']
            }]
        });
        comments = comments.map(el => el.get({plain:true}));
        comments.forEach(data =>{
            data['nickName'] = data['User']['nickname'];
            delete data['User']
        });
        res.status(OK).json({  "data": comments});
    }catch (error){
        errorApi(commentError.createdNotComment,BAD_REQUEST)
    }
});

router.put("/:commentId",jwtVerify,async (req,res,next) => {
    const {commentId} = req.params;
    const userId = res.locals.userId;
    const {comment} = req.body;
    if(!comment){
        errorApi(common.invalidDataType,PRECONDITION_FAILED)
    }
    try {
        let commentFind = await Comments.findAndCountAll({where: {"userId":userId}})
        if(!commentFind.count){
            errorApi(commentError.notComment,NOT_FOUND);
        }

        let nowDate= new Date();
        let updatedAt = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();

        await Comments.update({"content":comment, 'updatedAt':updatedAt},{
            where: {"commentId":commentId}
        });
    }catch (error){
        errorApi(commentError.editCommentFail,BAD_REQUEST)
    }

});

router.delete("/:commentId",jwtVerify,async (req,res,next) => {
    try {
        const commentId = req.params;
        let comment = await Comments.findAndCountAll({
            where: commentId
        })
        if(!comment.count){
            errorApi(commentError.notComment,NOT_FOUND)
        }
        await Comments.destroy({where:commentId})
        res.status(OK).json({  "message": "댓글을 삭제하였습니다."});
    }catch (error){
        errorApi(commentError.deleteCommentFail,BAD_REQUEST);
    }
});

module.exports = router;


