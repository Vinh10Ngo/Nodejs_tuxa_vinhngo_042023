const MainModel 	= require(__path_schemas + 'user');


module.exports = {
 
    create : async (item) => {
        const user = await new MainModel(item).save();
        return  await user.getSignedJwtToken();
    },
    login : async (item, res) => {
        const { email, password } = item
        const result = await MainModel.findByCredentials(email, password)
        if (result.err) {
            res.status(401).json({success : true,message : result.err})
            return false
        }
        return await result.user.getSignedJwtToken()
    },
    forgotPassword : async (item) => {
        const user = await MainModel.findOne({email: item.email})
        if (!user) return false
        const resetToken = user.resetPassword()
        await new MainModel(user).save()
        return resetToken
    },
}