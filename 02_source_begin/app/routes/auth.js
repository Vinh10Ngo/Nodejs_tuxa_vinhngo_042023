var express = require('express');
var router = express.Router();
const systemConfig  = require(__path_configs + 'system');
var asyncHandler    = require(__path_middleware + 'async')
var ErrorResponse   = require(__path_utils + 'ErrorResponse')
var {protect}       = require(__path_middleware + 'auth')

const controllerName = 'auth'
const MainModel = require(__path_models + controllerName)
const MainValidate	= require(__path_validates + 'password');


router.post('/register', asyncHandler (async (req, res, next) => {
    let err = await validateReq(req, res, next)
    if(!err){
        const token = await MainModel.create(req.body);
        if (token) {
            saveCookieResponse(res, 201, token)
        }
    }
}))

router.post('/login', asyncHandler (async (req, res, next) => {
    const token = await MainModel.login(req.body, res);
    if (token) {
        saveCookieResponse(res, 201, token)
    }
}))

router.get('/me', protect, asyncHandler (async (req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
}))

router.post('/forgotPassword', asyncHandler (async (req, res, next) => {
   const result = await MainModel.forgotPassword(req.body)
   if (!result) res.status(401).json({success: true, message: 'Email không tồn tại'}) 
   res.status(200).json({
    success: true,
    data: result
    })
}))

router.post('/resetPassword/:resetToken', asyncHandler (async (req, res, next) => {
    let err = await validateReq(req,res, next);
    if (!err) {
        const user = await MainModel.resetPassword({resetToken: req.params.resetToken, password: req.body.password})
        if (!user) res.status(401).json({success: true, message: 'Token không tồn tại'}) 
        res.status(201).json({
            success: true,
            user
        })
    }  
 }))

 router.get('/logout', protect, asyncHandler (async (req, res, next) => {
    res.status(200)
    .cookie('token','none', {
        expirers : new Date (
            Date.now() + 10 * 1000
        ),
        httpOnly : true
    })
    .json({
        success : true,
    })
}))

const validateReq = async (req, res, next) => {
    let err = await MainValidate.validator(req)
    if(Object.keys(err).length > 0) {
        next(new ErrorResponse(400, err));
        return true
    }
    return false
}

const saveCookieResponse = (res,statusCode,token) => {
    const options = {
        expirers : new Date (
            Date.now() + systemConfig.COOKIE_EXP * 24 * 60 * 60 * 1000
        ),
        httpOnly : true
    }

    res.status(statusCode)
    .cookie('token',token,options)
    .json({
        success : true,
        token
    })
}

module.exports = router;

