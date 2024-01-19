var express = require('express');
var router = express.Router();
var { protect, authorize } = require('../middleware/auth');

router.use('/product', require('./product'))
router.use('/category', require('./category'))
router.use('/user', protect, authorize('admin'), require('./user'))
router.use('/auth', require('./auth'))


module.exports = router;
