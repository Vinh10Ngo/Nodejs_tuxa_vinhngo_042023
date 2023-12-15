var express = require('express');
var router = express.Router();

const articleModel = require(__path__models + 'article')
const utilsHelpers = require(__path__helpers + 'utils')
const categoryModel = require(__path__models + 'category')
const paramsHelpers = require(__path__helpers + 'params')
const folderViewsNews = __path__views__news + 'pages/category/'
const layoutNews = __path__views__news + 'frontend'
const controllerName = 'category'


/* GET ĩndex page. */
router.get('/:id', async function(req, res, next) {
  let idCategory = paramsHelpers.getParams(req.params, 'id', '')
  let keyword = paramsHelpers.getParams(req.query, 'search', '')
  const page = paramsHelpers.getParams(req.query, 'page', 1) 
  let itemsCategory = []
  let itemsInCategory = []
  let itemsMostPopular = []
  let itemsSpecialCategory = []
  let perPage = 1
  let totalItems = 1
  let pageRange = 3

  await categoryModel.listItemsFrontend(null, {task: 'item-in-menu'}).then((items) => {
    itemsCategory = items
  })
  await articleModel.listItemsFrontend(null, {task: 'item-special-category'}).then((items) => {
    itemsSpecialCategory = items
  });
  await articleModel.countArticleFrontend({id: idCategory }, {task: 'item-in-category'}).then((data) => {
    totalItems = data
  })
  let totalPages = Math.ceil(totalItems/perPage)

  await articleModel.listItemsFrontend({ id: idCategory}, {task: 'item-in-category-page'})
  .skip((page - 1) * perPage)
  .limit(perPage)
  .then((items) => {
    itemsInCategory = items
  })
  

  await articleModel.getMostPopularArticles().then((items) => {
    itemsMostPopular = items
  })
  let countArticlesInCategory = await utilsHelpers.countArticlesInCategory(itemsCategory)
  
  let paginationCatgoryPage = await utilsHelpers.paginate(page, totalPages, pageRange)
  
  res.render(`${folderViewsNews}category`, { 
    layout: layoutNews,
    itemsCategory,
    itemsInCategory,
    controllerName,
    totalPages,
    idCategory,
    itemsMostPopular,
    itemsSpecialCategory,
    pageTitle: 'Category',
    keyword,
    totalItems,
    countArticlesInCategory,
    paginationCatgoryPage
  }); 
});


module.exports = router;

