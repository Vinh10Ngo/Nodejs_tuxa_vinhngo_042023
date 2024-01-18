var express = require('express');
var router = express.Router ();

const controllerName = 'configuration'
// const util = require('util')
const mainModel = require(__path__models + controllerName)
const systemConfigs = require(__path__configs + 'system')
const notifyHelpers = require(__path__helpers + 'notify')
const linkIndex = '/' + systemConfigs.prefixAdmin + '/dashboard/'



const pageTitleIndex = 'Item Manager::'
const pageTitleEdit = pageTitleIndex + 'Edit'
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`

/* GET users listing. */


//form

router.get('/', async function(req, res, next) {
  await mainModel.getFormData({}).then(item => {
    res.render(`${folderViewsAdmin}config-form`, { pageTitle: pageTitleEdit, controllerName, item });
  })
});


//SAVE
router.post('/save', (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  let item = Object.assign(req.body)
  let username = req.user.username
    mainModel.saveItem(item, username, null).then((saveItemResult) => {
      notifyHelpers.show(req, res, linkIndex, { task: 'edit' });
    })
  })




module.exports = router;


