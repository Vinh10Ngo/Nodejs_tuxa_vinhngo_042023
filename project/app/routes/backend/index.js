var express = require('express');
var router = express.Router();
const middleGetUserInfo = require(__path__middleware + 'get-user-info')
const middleAuthetication = require(__path__middleware + 'auth')

/* GET home page. */
router.use('/', middleAuthetication, middleGetUserInfo, require('./home'));
router.use('/items', require('./items'));
router.use('/configuration', require('./configuration'));
router.use('/dashboard', require('./dashboard'));
router.use('/contact', require('./contact'));
router.use('/groups', require('./groups'));
router.use('/users', require('./users'));
router.use('/category', require('./category'));
router.use('/categoryRss', require('./categoryRss'));
router.use('/article', require('./article'));
router.use('/articleRss', require('./articleRss'));




module.exports = router;
