var express = require('express');
var router = express.Router();

const folderViewsNews = __path__views__news + 'pages/blog-grid/'
const layoutNews = __path__views__news + 'frontend'

/* GET ĩndex page. */
router.get('/', function(req, res, next) {
  res.render(`${folderViewsNews}blog-grid`, { 
    layout: layoutNews
  });
});


module.exports = router;
