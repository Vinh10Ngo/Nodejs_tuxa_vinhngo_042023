var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/', require('./home'));
router.use('/blog-detail', require('./blog-detail'));
router.use('/category', require('./category'));
router.use('/about', require('./about'));
router.use('/blog-list', require('./blog-list'));
router.use('/contact', require('./contact'));

module.exports = router;
