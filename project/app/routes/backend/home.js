var express = require('express');
var router = express.Router();

const folderViews = __path__views + 'pages/home/'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(`${folderViews}index`, { pageTitle: 'HomePage' });
});


module.exports = router;
