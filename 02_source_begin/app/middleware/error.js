var errorResponse = require('../utils/errorResponse')

const errorHandler =  (err, req, res, next) =>  {
    console.log(err.name.red)
    let error = {...err}
    if(error.name ===  'CastError') {
        let message = 'Không tồn tại dữ liệu'
        error = new errorResponse(404, message)
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'server error'

    })
  }

  module.exports = errorHandler