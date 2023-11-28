var express = require('express');
var router = express.Router();

const articleModel = require(__path__models + 'article')
const categoryModel = require(__path__models + 'category')
const paramsHelpers = require(__path__helpers + 'params')
const folderViewsNews = __path__views__news + 'pages/blog-detail/'
const layoutNews = __path__views__news + 'frontend'

/* GET blog-detail page. */
router.get('/:id', async function(req, res, next) {
  let idCategory = paramsHelpers.getParams(req.params, 'id', '')
  let itemsCategory = []
  let itemsInCategory = []
  let itemsAll = []
  let itemsBlogDetail = []
  let idBlogDetail = paramsHelpers.getParams(req.params, 'id', '')
  await categoryModel.listItemsFrontend(null, {task: 'item-in-menu'}).then((items) => {
    itemsCategory = items
  })
  await articleModel.getItemsFrontend({id: idBlogDetail}, null).then((items) => {
    itemsBlogDetail = items
  })
  await articleModel.listItemsFrontend({id: idCategory}, {task: 'item-in-category'}).then((items) => {
    itemsInCategory = items
  })
  await articleModel.listItemsFrontend(null, {task: 'item-all'}).then((items) => {
    itemsAll = items
  })
  res.render(`${folderViewsNews}blog-detail`, { 
    layout: layoutNews,
    itemsCategory,
    itemsBlogDetail,
    itemsAll
    
  });
});

module.exports = router;
