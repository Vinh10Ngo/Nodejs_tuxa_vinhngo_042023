var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('themes/login', {pageTitle: 'Admin' });
});
router.get('/dashboard', function(req, res, next) {
  res.render('themes/dashboard', { pageTitle: 'Dashboard' });
});
router.get('/list', function(req, res, next) {
  res.render('themes/list', { pageTitle: 'Book Manager:: List' });
});
router.get('/form', function(req, res, next) {
  res.render('themes/form', { pageTitle: 'Category Manager:: Add' });
});

module.exports = router;
