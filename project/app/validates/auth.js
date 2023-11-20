
const notifyConfigs = require(__path__configs + 'notify');
const util = require('util')

const options = {
    email: {min: 5, max: 20},
    password: {min: 5, max: 10}
}

module.exports = {
    validator: (req) => {
        req.checkBody('email', util.format(notifyConfigs.ERROR_EMAIL, options.email.min, options.email.max)).isLength({min: options.email.min, max: options.email.max})
        req.checkBody('password', util.format(notifyConfigs.ERROR_PASSWORD, options.password.min, options.password.max)).isLength({min: options.password.min, max: options.password.max})
        
        let errors = req.validationErrors()
        
        return errors
    }
}