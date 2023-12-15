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
  let itemsCategory = []
  let itemsBlogDetail = []
  let itemsMostPopular = []
  let itemsKeyword = []


  let idBlogDetail = paramsHelpers.getParams(req.params, 'id', '')
  await categoryModel.listItemsFrontend(null, {task: 'item-in-menu'}).then((items) => {
    itemsCategory = items
  })
  await articleModel.getItemsFrontend({id: idBlogDetail}, null).then((items) => {
    itemsBlogDetail = items
  })
  await articleModel.countView({id: idBlogDetail}).then((items) => {
  })
  await articleModel.getMostPopularArticles().then((items) => {
    itemsMostPopular = items
  })
  await articleModel.listItemsFrontend({ keyword: keyword}, {task: 'item-keyword'}).then((items) => {
    itemsKeyword = items
  })
  let countArticlesInCategory = await utilsHelpers.countArticlesInCategory(itemsCategory)

  res.render(`${folderViewsNews}blog-detail`, { 
    layout: layoutNews,
    itemsCategory,
    itemsBlogDetail,
    controllerName,
    itemsMostPopular,
    pageTitle: 'Blog-Detail',
    countArticlesInCategory,
    idCategory,
    itemsKeyword,
    keyword
    
  });
});


module.exports = router;
