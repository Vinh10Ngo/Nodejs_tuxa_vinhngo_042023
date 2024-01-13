var express = require('express');
var router = express.Router();

const articleModel = require(__path__models + 'article')
const utilsHelpers = require(__path__helpers + 'utils')
const categoryModel = require(__path__models + 'category')
const paramsHelpers = require(__path__helpers + 'params')
const folderViewsNews = __path__views__news + 'pages/blog-detail/'
const layoutNews = __path__views__news + 'frontend'
const controllerName = 'blog-detail'


/* GET blog-detail page. */
router.get('/:id', async function(req, res, next) {
  let idCategory = ''
  let keyword = paramsHelpers.getParams(req.query, 'search', '')
  let itemsBlogDetail = []
  let itemsKeyword = []


  let idBlogDetail = paramsHelpers.getParams(req.params, 'id', '')

  await articleModel.getItemsFrontend({id: idBlogDetail}, null).then((items) => {
    itemsBlogDetail = items
  })
  await articleModel.countView({id: idBlogDetail}).then((items) => {
  })
 
  await articleModel.listItemsFrontend({ keyword: keyword}, {task: 'item-keyword'}).then((items) => {
    itemsKeyword = items
  })

  res.render(`${folderViewsNews}blog-detail`, { 
    layout: layoutNews,
    itemsBlogDetail,
    controllerName,
    pageTitle: 'Blog-Detail',
    idCategory,
    itemsKeyword,
    keyword,
    itemsBlogDetail
  });
});


module.exports = router;
