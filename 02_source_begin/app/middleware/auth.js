const asyncHandler  = require("./async");
var ErrorResponse   = require(__path_utils + 'ErrorResponse')
var jwt = require('jsonwebtoken');
const systemConfig = require(__path_configs + 'system')
var UserModel = require(__path_models + 'user')

exports.protect = asyncHandler (async (req, res, next) => {
  console.log(req.cookies.token);
  let token = ''
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.token){
    token = req.cookies.token
    console.log('abc');
  }
  if (!token) return next(new ErrorResponse(401, 'Vui lòng đăng nhập tài khoản'))

  //decode token
  try {
    const decoded = jwt.verify(token, systemConfig.JWT_SECRET)
    req.user = await UserModel.listItems({id: decoded.id}, {task: 'one'})
    next()
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse(401, 'Vui lòng đăng nhập tài khoản'))
  }
})

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(403, 'Bạn không có quyền truy cập'))
    }
    next()
  }
}