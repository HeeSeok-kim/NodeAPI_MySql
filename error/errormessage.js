const ERROR_MESSAGE = {
    common: {
        invalidDataRequest:"요청한 데이터 형식이 올바르지 않습니다.",
        invalidDataType:"데이터 형식이 올바르지 않습니다."
    },
    userError : {
        overlapId:"중복된 닉네임입니다.",
        invalidPw:"패스워드가 일치하지 않습니다.",
        invalidIdForm:"ID의 형식이 일치하지 않습니다.",
        invalidPwForm:"패스워드 형식이 일치하지 않습니다.",
        includeId:"패스워드에 닉네임이 포함되어 있습니다.",
        invalidUser:"닉네임 또는 패스워드를 확인해주세요.",
        loginFail:"로그인에 실패하였습니다.",
        loginError:"이미 로그인이 되어있습니다.",
        notJwtToken:"로그인이 필요합니다"
    },
    postError : {
        invalidTitleForm:"게시글 제목의 형식이 일치하지 않습니다.",
        invalidContentForm:"게시글 내용의 형식이 일치하지 않습니다.",
        createdFailPost:"게시글 작성에 실패하였습니다.",
        notPost:"게시글 조회에 실패하였습니다.",
        notEditPost:"게시글이 정상적으로 수정되지 않았습니다.",
        postEditFail:"게시글 수정에 실패하였습니다.",
        postNotFound:"게시글이 존재하지 않습니다.",
        notDeletePost:"게시글이 정상적으로 삭제되지 않았습니다.",
        likePostFail:"좋아요 게시글 조회에 실패하였습니다",
        likeFail:"게시글 좋아요에 실패하였습니다"
    },
    commentError : {
        createdNotComment : "댓글 작성에 실패하였습니다.",
        notSearchComment: "댓글 조회에 실패하였습니다.",
        notComment:"댓글이 존재하지 않습니다.",
        notEditComment:"댓글 수정이 정상적으로 처리되지 않았습니다.",
        editCommentFail:"댓글 수정에 실패하였습니다",
        notDeleteComment:"댓글 삭제가 정상적으로 처리되지 않았습니다.",
        deleteCommentFail:"댓글 삭제에 실패하였습니다"
    }
}


module.exports = ERROR_MESSAGE