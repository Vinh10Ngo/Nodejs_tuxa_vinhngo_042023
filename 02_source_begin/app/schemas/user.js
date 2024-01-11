const mongoose = require('mongoose');
const databaseConfig  = require(__path_configs + 'database');
const systemConfig 		= require(__path_configs + 'system');
const notify 			= require(__path_configs + 'notify');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const crypto 			= require('crypto');


var schema = new mongoose.Schema({
	username 		    : String,
	email		    	: String,
	role		    	: String,
	password		    : String,
	resetPassToken	    : String,
	resetPassTokenExp   : String
})

schema.pre('save', function(next) {
	const salt = bcrypt.genSaltSync(10);
	this.password = bcrypt.hashSync(this.password, salt);
	next()
})

schema.methods.getSignedJwtToken = function() {
	return jwt.sign({ id : this._id}, systemConfig.JWT_SECRET, {
		expiresIn : systemConfig.JWT_EXP
	})
}

schema.statics.findByCredentials = async function (email,password) {
	let err = ''
	// check empty 
	if(!email || !password) return {err: notify.ERROR_EMAIL_EMPTY}
	// check email	
	const user = await this.findOne({email : email});
	if (!user) return { err: notify.ERROR_LOGIN }
	//check password
	const isMatch = await bcrypt.compare(password, user.password)
	if (!isMatch) return { err: notify.ERROR_LOGIN }
	return {user}
}

schema.methods.resetPassword = function() {
	const resetToken = crypto.randomBytes(20).toString('hex')
	
	this.resetPassToken = crypto
	.createHash('sha256')
	.update(resetToken)
	.digest('hex');

	this.resetPassTokenExp = Date.now() + 10 * 60 * 1000;
	return resetToken;
} 

module.exports = mongoose.model(databaseConfig.col_user, schema)