var express = require('express');
var router = express.Router ();

const controllerName = 'configuration'
// const util = require('util')
const mainModel = require(__path__models + controllerName)
const systemConfigs = require(__path__configs + 'system')
const notifyHelpers = require(__path__helpers + 'notify')
const linkIndex = '/' + systemConfigs.prefixAdmin + '/dashboard/'

const pageTitleIndex = 'Item Manager::'
const pageTitleAdd = pageTitleIndex + 'Add'
const pageTitleEdit = pageTitleIndex + 'Edit'
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`

/* GET users listing. */


//form
router.get('/general/', async function(req, res, next) {
  await mainModel.getFormData({}).then(item => {
    res.render(`${folderViewsAdmin}general-form`, { pageTitle: pageTitleEdit, controllerName, item });
  })
});
router.get('/social/', async function(req, res, next) {
  await mainModel.getFormData({}).then(item => {
    console.log(item);
    res.render(`${folderViewsAdmin}social-form`, { pageTitle: pageTitleEdit, controllerName, item });
  })
});

//SAVE
router.post('/general/save', (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  let item = Object.assign(req.body)
  let username = 'phucvinh'
    mainModel.saveItem(item, username, {task: 'general'}).then(result => {
      notifyHelpers.show(req, res, linkIndex, {task: 'edit'})
    })  
})
router.post('/social/save', (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  let item = Object.assign(req.body)
  console.log(item);
  let username = 'phucvinh'
    mainModel.saveItem(item, username, {task: 'social'}).then(result => {
      notifyHelpers.show(req, res, linkIndex, {task: 'edit'})
    })  
})




module.exports = router;


