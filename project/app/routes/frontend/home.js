var express = require('express');
var router = express.Router();

const folderViewsNews = __path__views__news + 'pages/'
const layoutNews = __path__views__news + 'frontend'

/* GET ĩndex page. */
router.get('/index', function(req, res, next) {
  res.render(`${folderViewsNews}index`, { 
    layout: layoutNews
  });
});
router.get('/blog-detail-01', function(req, res, next) {
  res.render(`${folderViewsNews}blog-detail-01`, { 
    layout: layoutNews
  });
});

module.exports = router;
