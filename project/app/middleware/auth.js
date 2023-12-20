const systemConfigs = require(__path__configs + 'system')
const controllerName = 'auth'
const linkRedirect = ('/' + systemConfigs.prefixNews + `/${controllerName}/`).replace(/(\/)\1+/g, '$1')

module.exports = (req, res, next) => {
    req.user.username = ''
  if (req.isAuthenticated()) {
      if(req.user.username == 'phucvinh') {
          next()
      } else {
          res.redirect(`${linkRedirect}no-permission`)
      }

  } else {
        next()
    //   res.redirect(`${linkRedirect}login`)
  }
}