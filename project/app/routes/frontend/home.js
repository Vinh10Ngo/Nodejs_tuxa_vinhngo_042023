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
router.get('/blog-detail-02', function(req, res, next) {
  res.render(`${folderViewsNews}blog-detail-02`, { 
    layout: layoutNews
  });
});
router.get('/blog-grid', function(req, res, next) {
  res.render(`${folderViewsNews}blog-grid`, { 
    layout: layoutNews
  });
});
router.get('/blog-list-01', function(req, res, next) {
  res.render(`${folderViewsNews}blog-list-01`, { 
    layout: layoutNews
  });
});
router.get('/blog-list-02', function(req, res, next) {
  res.render(`${folderViewsNews}blog-list-02`, { 
    layout: layoutNews
  });
});
router.get('/category-01', function(req, res, next) {
  res.render(`${folderViewsNews}category-01`, { 
    layout: layoutNews
  });
});
router.get('/category-02', function(req, res, next) {
  res.render(`${folderViewsNews}category-02`, { 
    layout: layoutNews
  });
});
router.get('/about', function(req, res, next) {
  res.render(`${folderViewsNews}about`, { 
    layout: layoutNews
  });
});
router.get('/contact', function(req, res, next) {
  res.render(`${folderViewsNews}contact`, { 
    layout: layoutNews
  });
});
router.get('/home-02', function(req, res, next) {
  res.render(`${folderViewsNews}home-02`, { 
    layout: layoutNews
  });
});
router.get('/home-03', function(req, res, next) {
  res.render(`${folderViewsNews}home-03`, { 
    layout: layoutNews
  });
});



module.exports = router;
