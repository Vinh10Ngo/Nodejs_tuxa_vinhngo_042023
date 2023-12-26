var express = require('express');
var router = express.Router();

const folderViewsNews = __path__views__news + 'pages/others/'
const systemConfigs = require(__path__configs + 'system')
const notifyHelpers = require(__path__helpers + 'notify')
const layoutNews = __path__views__news + 'frontend'
const controllerName = 'contact'
const paramsHelpers = require(__path__helpers + 'params')
const mainValidate = require(__path__validates + controllerName)
const mainModel = require(__path__models + controllerName)
const linkRedirect = ('/' + systemConfigs.prefixNews + `/${controllerName}/`).replace(/(\/)\1+/g, '$1')



/* GET ĩndex page. */
router.get('/', async function(req, res, next) {
  let errors = null

  res.render(`${folderViewsNews}contact`, { 
    layout: layoutNews,
    pageTitle: 'Contact',
    controllerName,
    errors
    
  });
});
router.post('/save', function(req, res, next) {
  req.body = JSON.parse(JSON.stringify(req.body));;
  let item = Object.assign(req.body)
  let name = paramsHelpers.getParams(req.query, 'name', '')
  let errors = mainValidate.validator(req)
  let username = "phucvinh"
  if(Array.isArray(errors) && errors.length > 0) {
    res.render(`${folderViewsNews}contact`, { 
      layout: layoutNews,
      pageTitle: 'Contact',
      controllerName,
      errors
    });
  } else {
    mainModel.saveItem(item, username).then((item) => {
      notifyHelpers.show(req, res, linkRedirect, {task: 'contact'})
    })
  }
});

module.exports = router;
