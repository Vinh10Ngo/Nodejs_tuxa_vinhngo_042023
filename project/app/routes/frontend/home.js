var express = require('express');
var router = express.Router();

const articleModel = require(__path__models + 'article')
const paramsHelpers = require(__path__helpers + 'params')
const categoryModel = require(__path__models + 'category')
const folderViewsNews = __path__views__news + 'pages/home/'
const layoutNews = __path__views__news + 'frontend'

/* GET ĩndex page. */
router.get('/index', async function(req, res, next) {
  let idCategory = paramsHelpers.getParams(req.params, 'id', '')
  let itemsSpecial = []
  let itemsLatest = []
  let itemsCategory = []
  let itemsInCategory = []
  let itemsAll = []
  let itemsHover = []

  await articleModel.listItemsFrontend(null, {task: 'item-special'}).then((items) => {
    itemsSpecial = items
  });
  await articleModel.listItemsFrontend(null, {task: 'item-latest'}).then((items) => {
    itemsLatest = items
  });
  await categoryModel.listItemsFrontend(null, {task: 'item-in-menu'}).then((items) => {
    itemsCategory = items
  })
  await articleModel.listItemsFrontend({id: idCategory}, {task: 'item-in-category'}).then((items) => {
    itemsInCategory = items
  })
  await articleModel.listItemsFrontend(null, {task: 'item-all'}).then((items) => {
    itemsAll = items
  })

  res.render(`${folderViewsNews}index`, { 
    layout: layoutNews,
    itemsSpecial,
    itemsLatest,
    itemsCategory,
    itemsInCategory,
    itemsAll,
    itemsHover
  });
})

router.get('/category-hover/:id', async function(req, res, next) {
  let itemsHover = []
  let idCategory = paramsHelpers.getParams(req.params, 'id', '')
  console.log(idCategory);
  await articleModel.listItemsFrontend({id: idCategory}, {task: 'item-hover'}).then((items) => {
    itemsHover = items
  })
  console.log(itemsHover);
  res.render(`${folderViewsNews}index`, { 
    layout: layoutNews,
    itemsHover
  });
});

module.exports = router;
