var express = require('express');
var router = express.Router();

const passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var md5 = require('md5');

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const usersModel = require(__path__models + 'users')
const groupsModel = require(__path__models + 'groups')
const systemConfigs = require(__path__configs + 'system')
const notifyConfigs = require(__path__configs + 'notify');
const controllerName = 'auth'
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`
const layoutLogin = __path__views__admin + 'login' 
const mainValidate = require(__path__validates + controllerName)
const linkRedirect = '/' + systemConfigs.prefixAdmin + `/${controllerName}/`

router.get('/login', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect(`/${systemConfigs.prefixAdmin}/dashboard`)
  }
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
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { 
      return next(err); 
    }
    res.redirect(`${linkRedirect}login`);
  });
});

router.get('/no-permission', async(req, res, next) => {
  res.render(`${folderViewsAdmin}no-permission`, {
    pageTitle: 'No Permission',
 });
});
  
router.post('/post', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect(`/${systemConfigs.prefixAdmin}/dashboard`)
  }
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = Object.assign(req.body);
    let errors = mainValidate.validator(req);

    if (Array.isArray(errors) && errors.length > 0) {
      console.log('có lỗi');
         res.render(`${folderViewsAdmin}login`, {
            item,
            errors,
            controllerName,
            pageTitle: 'Admin',
            layout: layoutLogin
        });
    } else {
      console.log('không có lỗi');
      passport.authenticate('local', {
        successRedirect: `/${systemConfigs.prefixAdmin}/dashboard`,
        failureRedirect: `${linkRedirect}login`,
        failureFlash: true
      })(req, res, next)
    }
  });

  passport.use(new LocalStrategy(
    async (username, password, done) => {
      console.log(md5(password));
      try {
        await usersModel.getItemsByUserName(username, null).then((users) => {
          let user = users[0]
          if (user === undefined || user.length == 0) {
            return done(null, false, {message: notifyConfigs.ERROR_LOGIN});
          } else {
            if (md5(password) !== user.password) {
              return done(null, false, {message: notifyConfigs.ERROR_LOGIN });
            } else {
              console.log('dang nhap ok');
              return done(null, user);
            }
          }
        })
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      await usersModel.getItems(id).then((user) => {
        if (user) {
          const groupsID = user.groups.id
          groupsModel.getItems(groupsID).then((groupsInfo) => {
            if (groupsInfo) {
              user.groups = groupsInfo 
              console.log(user.groups);
            }
            done(null, user)   
          })
        } else {
        done(null, user);
        }
      })     
    } catch (error) {
      done(error);
    }
  });


  
module.exports = router