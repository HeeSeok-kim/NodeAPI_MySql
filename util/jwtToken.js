const jwt = require("jsonwebtoken");
require('dotenv').config();
const errorApi = require("../error/errorApi");
const errorMessage = require("../error/errormessage");
const {common,userError} = errorMessage

let tokenObject = {};

const createAccessToken = function (id) {
    const accessToken = jwt.sign(
        {id: id},
        process.env.SECRETKEY,
        {expiresIn:'4h'}
    )

    return accessToken
}

const jwtVerify = (req,res,next) => {
    try{
        const {token} = req.cookies;
        let data = jwt.verify(token,process.env.SECRETKEY);
        console.log(data);
        if(!token){
            errorApi(userError.notJwtToken);
        }else {
            res.locals.userId = data['id'];
            next();
        }
    }catch (e){
        errorApi(userError.notJwtToken);
    }
}
module.exports = {createAccessToken,jwtVerify};