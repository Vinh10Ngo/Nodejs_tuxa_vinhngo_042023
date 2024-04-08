var express = require('express');
var router = express.Router();

const folderViewsNews = __path__views__news + 'pages/general-news-category/'
const controllerName = 'general-news-category'
const layoutNews = __path__views__news + 'frontend'
const RssModel = require(__path__models + 'rss')
const paramsHelpers = require(__path__helpers + 'params')
const systemConfigs = require(__path__configs + 'system')
const linkRedirect = ('/' + systemConfigs.prefixNews + `/${controllerName}/`).replace(/(\/)\1+/g, '$1')


router.get('(/:id)?', async function(req, res, next) {
    let params = paramsHelpers.createParams(req)
    let idCategory = paramsHelpers.getParams(req.params, 'id', '')
    let itemCategoryRssArray = []
    let obj = {}
    let articleRssFilterArr = []
    let categoryRssEdited = []
    let {articleRssFilterArrOutside, categoryRssEditedOutside} = await RssModel.listItemArticleFrontend(req, obj, RssModel, articleRssFilterArr, categoryRssEdited)
    let filterByCategoryEnd = await RssModel.getArticleInCateogory(idCategory, categoryRssEditedOutside, articleRssFilterArrOutside)
    res.render(`${folderViewsNews}general-news-category`, { 
        pageTitle: 'General News',
        layout: layoutNews,
        itemCategoryRssArray,
        articleRssFilterArr, 
        categoryRssEdited,
        articleRssFilterArrOutside,
        categoryRssEditedOutside,
        filterByCategoryEnd,
        params
    })
})
// filter category
router.get('/filter-category_frontend/:category_general_news_id', function(req, res, next) {
    // lấy category_general_news_id được truyền qua, lưu vào session với giá trị là category_general_news_id
    req.session.category_general_news_id = paramsHelpers.getParams(req.params, 'category_general_news_id', '')
    // trả về linkRedirect
    res.redirect(linkRedirect)  
  })
module.exports = router;
