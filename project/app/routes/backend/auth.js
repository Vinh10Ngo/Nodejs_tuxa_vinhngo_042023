var express = require('express');
var router = express.Router();

var LocalStrategy = require('passport-local');

const systemConfigs = require(__path__configs + 'system')
const controllerName = 'auth'
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`
const layoutLogin = __path__views__admin + 'login' 
const mainValidate = require(__path__validates + controllerName)
const linkRedirect = '/' + systemConfigs.prefixAdmin + `/${controllerName}/`.

router.get('/login', function(req, res, next) {
    let errors = null
    res.render(`${folderViewsAdmin}login`, {
        errors,
        controllerName,
        pageTitle: 'Admin',
        layout: layoutLogin
     });
});
router.post('/post', passport.authenticate('local', { failureRedirect: `${linkRedirect}login`, failureMessage: true }),
 function(req, res, next) {
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = Object.assign(req.body)
    let errors = mainValidate.validator(req)
    if(Array.isArray(errors) && errors.length > 0) {
        res.render(`${folderViewsAdmin}login`, {
            item,
            errors,
            controllerName,
            pageTitle: 'Admin',
            layout: layoutLogin
         });
    } else {
        console.log('ok');
    }
    
});

var strategy = new LocalStrategy(function verify(username, password, cb) {
  console.log(username);
});
  

module.exports = router