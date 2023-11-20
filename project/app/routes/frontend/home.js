var express = require('express');
var router = express.Router();

const articleModel = require(__path__models + 'article')
const categoryModel = require(__path__models + 'category')
const folderViewsNews = __path__views__news + 'pages/home/'
const layoutNews = __path__views__news + 'frontend'

/* GET ĩndex page. */
router.get('/index', async function(req, res, next) {
  let itemsSpecial = []
  let itemsLatest = []
  let itemsCategory = []

  await articleModel.listItemsFrontend(null, {task: 'item-special'}).then((items) => {
    itemsSpecial = items
  });
  await articleModel.listItemsFrontend(null, {task: 'item-latest'}).then((items) => {
    itemsLatest = items
  });
  await categoryModel.listItemsFrontend(null, {task: 'item-in-menu'}).then((items) => {
    itemsCategory = items
  })

  res.render(`${folderViewsNews}index`, { 
    layout: layoutNews,
    itemsSpecial,
    itemsLatest,
    itemsCategory
  });
})
  


module.exports = router;
