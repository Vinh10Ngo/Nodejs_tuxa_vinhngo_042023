var express = require('express');
var router = express.Router();

const systemConfigs = require(__path__configs + 'system')
const controllerName = 'auth'
const linkRedirect = '/' + systemConfigs.prefixAdmin + `/${controllerName}/`

/* GET home page. */
router.use('/auth', require('./auth'));
router.use('/', (req, res, next) => {
    if (req.isAuthenticated()) {
        if(req.user.username == 'phucvinh') {
            next()
        } else {
            res.redirect(`${linkRedirect}no-permission`)
        }

    } else {
        res.redirect(`${linkRedirect}login`)
    }
}, require('./home'));
router.use('/items', require('./items'));
router.use('/dashboard', require('./dashboard'));
router.use('/groups', require('./groups'));
router.use('/users', require('./users'));
router.use('/category', require('./category'));
router.use('/article', require('./article'));




module.exports = router;
