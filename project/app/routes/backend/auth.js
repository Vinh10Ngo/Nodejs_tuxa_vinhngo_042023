var express = require('express');
var router = express.Router();

const passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const usersModel = require(__path__schemas + 'users')
const systemConfigs = require(__path__configs + 'system')
const controllerName = 'auth'
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`
const layoutLogin = __path__views__admin + 'login' 
const mainValidate = require(__path__validates + controllerName)
const linkRedirect = '/' + systemConfigs.prefixAdmin + `/${controllerName}/`

router.get('/login', function(req, res, next) {
    let errors = null
    // let type = 'success'
    // const errorMessage = req.flash('error')[0];
    // console.log(errorMessage);
    res.render(`${folderViewsAdmin}login`, {
        errors,
        controllerName,
        pageTitle: 'Admin',
        layout: layoutLogin,
        // errorMessage,
        // type
     });
});

passport.use(new LocalStrategy(
    async (username, password, done) => {
        console.log('abc');
      try {
        const user = await usersModel.findOne({ username, password });
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
router.post('/post', async (req, res, next) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = Object.assign(req.body);
    let errors = mainValidate.validator(req);

    if (Array.isArray(errors) && errors.length > 0) {
        console.log('lỗi');
        return res.render(`${folderViewsAdmin}login`, {
            item,
            errors,
            controllerName,
            pageTitle: 'Admin',
            layout: layoutLogin
        });
    } else {
        passport.authenticate('local', {
            successRedirect: `${systemConfigs.prefixAdmin}/items/dashboard`,
            failureRedirect: `${linkRedirect}post`,
            failureFlash: true
        })(req, res, next)
    }
  });




  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await usersModel.findOne({ id });
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
module.exports = router