const asyncHandler  = require("./async");
var errorResponse = require('../utils/errorResponse')
var jwt = require('jsonwebtoken');
const systemConfig = require(__path_configs + 'system')
var UserModel = require(__path_models + 'user')

exports.protect = asyncHandler (async (req, res, next) => {
  let token = ''
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) return next(new errorResponse(401, 'Vui lòng đăng nhập tài khoản'))

  //decode token
  try {
    const decoded = jwt.verify(token, systemConfig.JWT_SECRET)
    req.user = await UserModel.listItems({id: decoded.id}, {task: 'one'})
    next()
  } catch (error) {
    return next(new errorResponse(401, 'Vui lòng đăng nhập tài khoản'))
  }
})

exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log(roles);
    if (!roles.includes(req.user.role)) {
      return next(new errorResponse(403, 'Bạn không có quyền truy cập'))
    }
    next()
  }
}