var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('themes/login', { title: 'Themes Login' });
});
router.get('/dashboard', function(req, res, next) {
  res.render('themes/dashboard', { title: 'Themes Dashboard' });
});
router.get('/list', function(req, res, next) {
  res.render('themes/list', { title: 'Themes Dashboard' });
});
router.get('/form', function(req, res, next) {
  res.render('themes/form', { title: 'Themes Dashboard' });
});

module.exports = router;
