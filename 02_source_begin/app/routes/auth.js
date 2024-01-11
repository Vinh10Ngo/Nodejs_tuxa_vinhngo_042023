var express = require('express');
var router = express.Router();
const systemConfig  = require(__path_configs + 'system');
var { protect } = require('../middleware/auth');
var asyncHandler = require('../middleware/async');
var errorResponse   = require('../utils/ErrorResponse')

const controllerName = 'auth'
const MainModel = require(__path_models + controllerName)
const MainValidate	= require(__path_validates + controllerName);


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
    resetToken: result
})
}))

const validateReq = async (req, res, next) => {
    let err = await MainValidate.validator(req)
    if(Object.keys(err).length > 0) {
        next(new errorResponse(400, err));
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

