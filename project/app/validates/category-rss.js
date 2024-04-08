
const notifyConfigs = require(__path__configs + 'notify');
const util = require('util')

const options = {
    name: {min: 5, max: 20},
    link: {min: 5, max: 100},
    status: {value: 'novalue'},
}

module.exports = {
    validator: (req) => {
        req.checkBody('name', util.format(notifyConfigs.ERROR_NAME, options.name.min, options.name.max)).isLength({min: options.name.min, max: options.name.max})
        req.checkBody('link', util.format(notifyConfigs.ERROR_NAME, options.link.min, options.link.max)).isLength({min: options.link.min, max: options.link.max})
        req.checkBody('status', notifyConfigs.ERROR_STATUS).isNotEqual(options.status.value)
 
        let errors = req.validationErrors()
        
        return errors

    }
}