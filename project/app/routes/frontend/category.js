var express = require('express');
var router = express.Router();

const articleModel = require(__path__models + 'article')
const categoryModel = require(__path__models + 'category')
const paramsHelpers = require(__path__helpers + 'params')
const folderViewsNews = __path__views__news + 'pages/category/'
const layoutNews = __path__views__news + 'frontend'

/* GET ĩndex page. */
router.get('/:id', async function(req, res, next) {
  let idCategory = paramsHelpers.getParams(req.params, 'id', '')
  let itemsCategory = []
  let itemsInCategory = []
  await categoryModel.listItemsFrontend(null, {task: 'item-in-menu'}).then((items) => {
    itemsCategory = items
  })
  await articleModel.listItemsFrontend({id: idCategory}, {task: 'item-in-category'}).then((items) => {
    itemsInCategory = items
  })
  res.render(`${folderViewsNews}category`, { 
    layout: layoutNews,
    itemsCategory,
    itemsInCategory
  });
});


module.exports = router;
