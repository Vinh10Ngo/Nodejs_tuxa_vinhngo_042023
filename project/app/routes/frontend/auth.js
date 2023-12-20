var express = require('express');
var router = express.Router();

const passport = require('passport')

const systemConfigs = require(__path__configs + 'system')
const controllerName = 'auth'
const layoutNews = __path__views__news + 'frontend'
const folderViewsNews = __path__views__news + `pages/${controllerName}/`
const layoutLogin = __path__views__news + 'login' 
const mainValidate = require(__path__validates + controllerName)
const linkRedirect = ('/' + systemConfigs.prefixNews + `/${controllerName}/`).replace(/(\/)\1+/g, '$1')
const middleGetCategoryForMenu = require(__path__middleware + 'get-category-for-menu')
const middleGetMostPopularItems = require(__path__middleware + 'get-most-popular-items')
const middleGetUserInfo = require(__path__middleware + 'get-user-info')

router.get('/login', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect(`/${systemConfigs.prefixNews}/index`)
  }
    let errors = null
    // let type = 'success'
    // const errorMessage = req.flash('error')[0];
    // console.log(errorMessage);
    res.render(`${folderViewsNews}login`, {
        errors,
        controllerName,
        pageTitle: 'Admin',
        layout: layoutLogin,
        // errorMessage,
        // type
     });
});
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { 
      return next(err); 
    }
    res.redirect(`${linkRedirect}login`);
  });
});

router.get('/no-permission', middleGetUserInfo, middleGetCategoryForMenu, middleGetMostPopularItems, async(req, res, next) => {
  res.render(`${folderViewsNews}no-permission`, {
    layout: layoutNews,
    pageTitle: 'No Permission',
 });
});
  
router.post('/post', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect(`/${systemConfigs.prefixNews}/index`)
  }
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = Object.assign(req.body);
    let errors = mainValidate.validator(req);

    if (Array.isArray(errors) && errors.length > 0) {
      console.log('có lỗi');
         res.render(`${folderViewsNews}login`, {
            item,
            errors,
            controllerName,
            pageTitle: 'Admin',
            layout: layoutLogin
        });
    } else {
      console.log('không có lỗi');
      passport.authenticate('local', {
        successRedirect: `/${systemConfigs.prefixNews}/index`,
        failureRedirect: `${linkRedirect}login`,
        failureFlash: true
      })(req, res, next)
    }
  });

 


  
module.exports = router