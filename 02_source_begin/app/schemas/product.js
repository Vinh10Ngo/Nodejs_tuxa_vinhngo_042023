const mongoose = require('mongoose');
const databaseConfig  = require(__path_configs + 'database');
const {Schema} 			= require('mongoose');

var schema = new mongoose.Schema({
	name 		    : String,
	category	    : {
						id : {type: Schema.Types.ObjectId},
						name : String
					},
	category_id		: {
							type: Schema.Types.ObjectId,
							ref: 'category',
							required: true
						},
	price		    : Number,
	price_old		: Number,
	description		: String,
	like 	    	: Number,
	special		    : Boolean,
	brand		    : String,
	size			: [String],
	color 			: [String]
})
module.exports = mongoose.model(databaseConfig.col_product, schema)