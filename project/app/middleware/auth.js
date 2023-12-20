const systemConfigs = require(__path__configs + 'system')
const controllerName = 'auth'
const linkRedirect = ('/' + systemConfigs.prefixNews + `/${controllerName}/`).replace(/(\/)\1+/g, '$1')

module.exports = (req, res, next) => {
  if (req.isAuthenticated()) {
      if(req.user.username == 'phucvinh') {
          next()
      } else {
          res.redirect(`${linkRedirect}no-permission`)
      }

  } else {
      res.redirect(`${linkRedirect}login`)
  }
}