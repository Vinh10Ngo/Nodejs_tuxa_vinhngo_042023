var express = require('express');
var router = express.Router();

const middleAuthetication = require(__path__middleware + 'auth')

/* GET home page. */
router.use('/', middleAuthetication, require('./home'));
router.use('/items', require('./items'));
router.use('/dashboard', require('./dashboard'));
router.use('/groups', require('./groups'));
router.use('/users', require('./users'));
router.use('/category', require('./category'));
router.use('/article', require('./article'));




module.exports = router;
