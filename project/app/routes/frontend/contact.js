var express = require('express');
var router = express.Router();

const categoryModel = require(__path__models + 'category')
const folderViewsNews = __path__views__news + 'pages/others/'
const layoutNews = __path__views__news + 'frontend'
const controllerName = 'contact'


/* GET ĩndex page. */
router.get('/', async function(req, res, next) {
  let itemsCategory = []
  await categoryModel.listItemsFrontend(null, {task: 'item-in-menu'}).then((items) => {
    itemsCategory = items
  })
  res.render(`${folderViewsNews}contact`, { 
    layout: layoutNews,
    itemsCategory,
    controllerName
    
  });
});


module.exports = router;
