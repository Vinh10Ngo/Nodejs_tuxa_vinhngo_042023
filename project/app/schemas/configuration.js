const mongoose = require('mongoose')
const databaseConfigs = require(__path__configs + 'database')

const schema = new mongoose.Schema({ 
    info: {
        address: String,
        copyright: String,
        content: String,
        phone: String,
        social: {
            facebook: String,
            youtube: String,
            twitter: String, 
            pinterest: String,
            instagram: String,
            email: String
        }
    },
    send_email: {
        email: String,
        password: String,
        BCC: String
    }
});

module.exports= mongoose.model(databaseConfigs.col_configuration, schema)