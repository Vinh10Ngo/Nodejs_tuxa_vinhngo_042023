const mongoose = require('mongoose')
const databaseConfigs = require(__path__configs + 'database')

const schema = new mongoose.Schema({ 
    postId: { type: String, ref: databaseConfigs.col_article},
    timestamp: { type: Date, default: Date.now },
});

module.exports= mongoose.model(databaseConfigs.col_recently_viewed, schema)