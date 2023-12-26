const mongoose = require('mongoose')
const databaseConfigs = require(__path__configs + 'database')

const schema = new mongoose.Schema({ 
    info: {
        address: String,
        copyright: String,
        social: {
            facebook: String,
            youtube: String,
            twitter: String, 
            pinterest: String,
            instagram: String,
            email: String
        }
    }
});

module.exports= mongoose.model(databaseConfigs.col_configuration, schema)