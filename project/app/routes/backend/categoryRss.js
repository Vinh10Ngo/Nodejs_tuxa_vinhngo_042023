var express = require('express');
var router = express.Router ();

var slug = require('slug')
const controllerName = 'categoryRss'
// const util = require('util')
const mainModel = require(__path__models + controllerName)
const notifyConfigs = require(__path__configs + 'notify');
const utilsHelpers = require(__path__helpers + 'utils')
const paramsHelpers = require(__path__helpers + 'params')
const mainValidate = require(__path__validates + controllerName)
const systemConfigs = require(__path__configs + 'system')
const notifyHelpers = require(__path__helpers + 'notify')
const { resourceLimits } = require('worker_threads');


const linkIndex = '/' + systemConfigs.prefixAdmin + `/${controllerName}/`

const pageTitleIndex = 'Category Manager::'
const pageTitleAdd = pageTitleIndex + 'Add'
const pageTitleEdit = pageTitleIndex + 'Edit'
const pageTitleList = pageTitleIndex + 'List'
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`

/* GET users listing. */


//form
router.get('/form(/:id)?', function(req, res, next) {
  let id = paramsHelpers.getParams(req.params, 'id', '')
  let username = 'phucvinh'
  let item =  {name: '', link: '', status: '', created: {user_name: username, time: Date.now()}, modified: {user_name: username, time: Date.now()}}
  let errors = null
  if(id !== '') {
   mainModel.getItems(id).then((item)=> {
      res.render(`${folderViewsAdmin}form`, { pageTitle: pageTitleEdit, controllerName, item, errors });
    })
  } else {
      res.render(`${folderViewsAdmin}form`, { pageTitle: pageTitleAdd, controllerName, item, errors
    });
  } 
});

//SAVE
router.post('/save', async (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  let item = Object.assign(req.body)
  let errors = mainValidate.validator(req)
  let oldnames = await mainModel.getItemsCondition({})
  let errorNameshake = utilsHelpers.isNameshake(oldnames, item.name)
  let username = 'phucvinh'
  let taskCurrent = (item !== 'undefined' && item.id !== '') ? 'edit' : 'add'
  if (taskCurrent == 'add') {  
    if (errorNameshake !== false && errors == false) {
      errors = []
      errors.push({param: 'name', msg: errorNameshake})
    }
  }
  if(Array.isArray(errors) && errors.length > 0) {
    if (taskCurrent == 'add') {
      if (errors[0].msg == errorNameshake) errors.pop()
      if (errorNameshake !== false) errors.push({param: 'name', msg: errorNameshake})
    }   
    let pageTitle = (taskCurrent == 'edit') ? pageTitleEdit : pageTitleAdd
    item.created = {user_name: null, time: null}
    item.modified = {user_name: null, time: null}
    res.render(`${folderViewsAdmin}form`, { pageTitle, item, controllerName, errors});
  } else {
      mainModel.saveItem(item, username, {task: taskCurrent}).then(result => {
        notifyHelpers.show(req, res, linkIndex, {task: taskCurrent})
  })
}
})

//sort
router.get('/sort/:sort_field/:sort_type', function(req, res, next) {
req.session.sort_field = paramsHelpers.getParams(req.params, 'sort_field', 'ordering')
req.session.sort_type = paramsHelpers.getParams(req.params, 'sort_type', 'asc')

res.redirect(linkIndex)  
})
// List category
router.get('(/:status)?', async (req, res, next) => {
  let params = paramsHelpers.createParams(req)

  let statusFilter = await utilsHelpers.createFilterStatus(params.currentStatus, controllerName)
  
  await mainModel.countItems(params).then((data) => {
    params.pagination.totalItems = data
  })
  mainModel
  .listItems(params)
  .then((items) => {
    res.render(`${folderViewsAdmin}list`, { 
      pageTitle: pageTitleList,
      items: items, 
      statusFilter: statusFilter,
      controllerName,
      params,
    });
  })
  //change status
  router.post('/change-status/:id/:status', function(req, res, next) {
    let username = 'phucvinh'
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    let id = paramsHelpers.getParams(req.params, 'id', '')
    mainModel.changeStatus(id, currentStatus, username, {task: "update-one"}).then((result) => {
      res.send({status: (currentStatus === 'active') ? 'inactive' : 'active'})
    });  
  });
  //change status - multi 
  router.post('/change-status/:status', function(req, res, next) {
  let username = 'phucvinh'
  let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    mainModel.changeStatus(req.body.cid, currentStatus, username, {task: "update-multi"}).then(result => {
      notifyHelpers.show(req, res, linkIndex, {task: 'change_status_multi', total: result.matchedCount})
    });
  });
  
  //delete
  router.get('/delete/:id/', function(req, res, next) {
    let id = paramsHelpers.getParams(req.params, 'id', '')
    mainModel.deleteItem(id, {task: 'delete-one'}).then(result => {
      notifyHelpers.show(req, res, linkIndex, {task: 'delete'})
    });
  })
});


module.exports = router;


