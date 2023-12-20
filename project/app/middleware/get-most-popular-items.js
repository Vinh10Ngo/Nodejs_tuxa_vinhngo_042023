
const articleModel = require(__path__models + 'article')

module.exports = async (req, res, next) => {
  await articleModel.getMostPopularArticles().then((items) => {
    res.locals.itemsMostPopular = items
})
  next()
}