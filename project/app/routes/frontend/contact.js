var express = require('express');
var router = express.Router();

const folderViewsNews = __path__views__news + 'pages/others/'
const layoutNews = __path__views__news + 'frontend'
const controllerName = 'contact'


/* GET ĩndex page. */
router.get('/', async function(req, res, next) {

  res.render(`${folderViewsNews}contact`, { 
    layout: layoutNews,
    pageTitle: 'Contact',
    controllerName
    
  });
});


module.exports = router;
