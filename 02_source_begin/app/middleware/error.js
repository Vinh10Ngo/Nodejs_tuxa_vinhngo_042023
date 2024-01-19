var ErrorResponse   = require(__path_utils + 'ErrorResponse')
var notify          = require(__path_configs + 'notify');

const errorHandler =  (err, req, res, next) =>  {
    console.log(err)
    let error = {...err, name: err.name}
    // console.log(error);
    if(error.name ===  'CastError') {
        let message = notify.ERROR_CASTERROR
        error = new ErrorResponse(404, message)
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'server error'

    })
  }

  module.exports = errorHandler