const mongoose = require('mongoose');
const databaseConfig  = require(__path_configs + 'database');
const {Schema} 			= require('mongoose');

var schema = new mongoose.Schema({
    name 		    : String,
	description 	: String,
	careers	        :  [{
						type: Schema.Types.ObjectId,
						ref: 'careers',
						required: true
					}],
	type		    : [String],
	local		    : [String],
	web		        : String,
	address 	    : String,
	phone		    : Number,
	email		    : String
})
module.exports = mongoose.model(databaseConfig.col_items, schema)