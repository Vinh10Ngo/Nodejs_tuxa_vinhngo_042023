var express = require('express');
var router = express.Router();

const folderViewsNews = __path__views__news + 'pages/general-news-blog/'
const layoutNews = __path__views__news + 'frontend'
const RssModel = require(__path__models + 'rss')
const paramsHelpers = require(__path__helpers + 'params')



router.get('/:id', async function(req, res, next) {
    let id = paramsHelpers.getParams(req.params, 'id', '')
    let itemCategoryRssArray = []
    let obj = {}
    let articleRssFilterArr = []
    let categoryRssEdited = []
    let {articleRssFilterArrOutside, categoryRssEditedOutside} = await RssModel.listItemArticleFrontend(req, obj, RssModel, articleRssFilterArr, categoryRssEdited)
    let eachArticle = await RssModel.getEachArticle(id, articleRssFilterArrOutside)
    res.render(`${folderViewsNews}general-news-blog`, { 
        pageTitle: 'General News',
        layout: layoutNews,
        itemCategoryRssArray,
        articleRssFilterArr, 
        categoryRssEdited,
        eachArticle
    })
})
module.exports = router;
