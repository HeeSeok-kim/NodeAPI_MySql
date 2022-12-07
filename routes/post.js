const express = require("express");
const router = express.Router();
//에러 핸들
const errorApi = require("../error/errorApi");
const StatusCodes = require('http-status-codes');
const errorMessage = require('../error/errormessage.js');
//DB
const {Posts,Users,likes} = require("../models");
const {Op} = require("sequelize");
//jwt토큰 인증 여부
const {jwtVerify} = require("../util/jwtToken.js");

const {common,postError} = errorMessage;
const {BAD_REQUEST,OK,PRECONDITION_FAILED,UNAUTHORIZED,NOT_FOUND} = StatusCodes;

router.get("/",async (req,res,next) => {
    try {
        //password, content 필드 제외 하고 날짜로 내림차순 정렬하기
        let posts = await Posts.findAll({
            include:[{
                model:Users,
                attributes:['nickname'],
            },{
                model:likes,
                as:"likes"
            }],
            order:[['updatedAt','DESC']]
        });

        posts = posts.map(el => el.get({plain:true}));

        posts.forEach(data =>{
            data['nickName'] = data['User']['nickname'];
            data['like'] = data['likes'].length;
            delete data['User']
            delete data['likes'];
        });

        res.status(OK).json({ data: posts });
    }catch (error){
        errorApi(postError.notPost,BAD_REQUEST);
    }
});

router.post("/",jwtVerify,async (req,res) => {
    //유저에게 받아올값
    const {title, content } = req.body;
    const {userId} = {userId:res.locals.userId};
    //에러처리
    if(!title || !content){
        errorApi(common.invalidDataType,PRECONDITION_FAILED);
    }
    try{
        await Posts.create({userId, title, content});
    }catch (error){
        errorApi(postError.createdFailPost,BAD_REQUEST);
    }
    //DB에 넣고 잘 성공했을시 200;
    res.status(OK).json({ message: "게시글을 생성하였습니다." });
})

router.get("/like",async (req,res)=>{
    try {
        let posts = await Posts.findAll({
            include:[{
                model:Users,
                attributes:['nickname'],
            },{
                model:likes,
                as:"likes"
            }],
            order:[['updatedAt','DESC']]
        });

        posts = posts.map(el => el.get({plain:true}));
        let result = [];
        posts.forEach(data => {
            if(data['likes'].length > 0){
                data['nickName'] = data['User']['nickname'];
                data['like'] = data['likes'].length;
                delete data['User']
                delete data['likes'];
                result.push(data);
            }
        })
        res.status(OK).json({ data: result });
    }catch (error) {
        errorApi(postError.likePostFail,BAD_REQUEST);
    }
})

router.get("/:postId",async (req,res,next) => {
    try {
        const postId = req.params;
        let post = await Posts.findAll({
            where: postId,
            include:[{
                model:Users,
                attributes:['nickname'],
            },{
                model:likes,
                as:"likes",
                plain:true
            }],
        });

        post = post.map(el => el.get({plain:true}));
        post.forEach(data =>{
            data['nickName'] = data['User']['nickname'];
            data['like'] = data['likes'].length;
            delete data['User']
            delete data['likes'];
        });

        res.status(OK).json({ data: post[0] });
    }catch (error){
        errorApi(postError.notPost,BAD_REQUEST);
    }
});

router.put("/:postId",jwtVerify,async (req,res) => {
    const postId = req.params;
    const {title, content } = req.body;
    if(!title || !content){
        errorApi(common.invalidDataType,PRECONDITION_FAILED)
    }
    try {
        let nowDate= new Date();
        let updatedAt = new Date(nowDate.getTime() - (nowDate.getTimezoneOffset() * 60000)).toISOString();

        await Posts.update({
            'title':title,
            'content':content,
            'updatedAt':updatedAt
        },{
            where: postId
        });
        res.status(OK).json({ "message": "게시글을 수정하였습니다."});
    }catch (error){
        errorApi(postError.notEditPost,UNAUTHORIZED)
    }
});



router.delete("/:postId",jwtVerify,async (req,res) => {
    const postId = req.params;

    let post = await Posts.findAndCountAll({
        where: postId,
    });

    if(!post.count){
        errorApi(postError.postNotFound,NOT_FOUND);
    }

    try {
        await Posts.destroy({where:postId})
        res.status(OK).json({  "message": "게시글을 삭제하였습니다."});
    }catch (error){
        errorApi(postError.notDeletePost,UNAUTHORIZED);
    }
});

router.put("/:postId/like",jwtVerify,async (req,res,next) => {
    const {userId} = {userId:res.locals.userId};
    const {postId} = req.params;

    let post = await Posts.findAndCountAll({
        where: {"postId":postId},
    });
    if(!post.count){
        errorApi(postError.postNotFound,NOT_FOUND)
    }
    try{
        let like = await likes.findAndCountAll({where:{"userId":userId,"postId":postId}});
        let message = "";
        if(like.count){
            await likes.destroy({where:{"userId":userId,"postId":postId}});
            message = "게시글의 좋아요를 취소하였습니다.";
        }else {
            await likes.create({"userId":userId,"postId":postId});
            message = "게시글의 좋아요를 등록하였습니다.";
        }
        res.status(OK).json({  "message": message});
    }catch (error){
        errorApi(postError.likeFail,BAD_REQUEST);
    }
});

module.exports = router;


