var errorResponse = require('../utils/errorResponse')
var notify        = require('./../configs/notify')

const errorHandler =  (err, req, res, next) =>  {
    console.log(err)
    let error = {...err, name: err.name}
    // console.log(error);
    if(error.name ===  'CastError') {
        let message = notify.ERROR_CASTERROR
        error = new errorResponse(404, message)
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'server error'

    })
  }

  module.exports = errorHandler