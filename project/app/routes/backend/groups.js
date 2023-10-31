var express = require('express');
var router = express.Router ();

const controllerName = 'groups'
// const util = require('util')
const mainModel = require(__path__models + controllerName)
const usersModel = require(__path__models + 'users')
const utilsHelpers = require(__path__helpers + 'utils')
const paramsHelpers = require(__path__helpers + 'params')
const mainValidate = require(__path__validates + controllerName)
const systemConfigs = require(__path__configs + 'system')
const notifyHelpers = require(__path__helpers + 'notify')
const { resourceLimits } = require('worker_threads');
const linkIndex = '/' + systemConfigs.prefixAdmin + `/${controllerName}/`

const pageTitleIndex = 'Group Manager::'
const pageTitleAdd = pageTitleIndex + 'Add'
const pageTitleEdit = pageTitleIndex + 'Edit'
const pageTitleList = pageTitleIndex + 'List'
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render(`${folderViewsAdmin}login`, {pageTitle: 'Admin' });
});
router.get('/dashboard', async(req, res, next) => {
  let countItems = 0
  await mainModel.count({}).then((data) => {
    countItems = data
  })
  res.render(`${folderViewsAdmin}dashboard`, {
     pageTitle: 'Dashboard',
     countItems: countItems 
  });
});
//form
router.get('/form(/:id)?', function(req, res, next) {
  let id = paramsHelpers.getParams(req.params, 'id', '')
  // let {id} = req.params
  let item =  {name: '', ordering: 0, status: 'novalue'}
  let errors = null
  if(id !== '') {
   mainModel.getItems(id).then((item)=> {
    res.render(`${folderViewsAdmin}form`, { pageTitle: pageTitleEdit, controllerName, item, errors });
    })
  } else {
    res.render(`${folderViewsAdmin}form`, { pageTitle: pageTitleAdd, controllerName, item, errors });
  }
});

//SAVE
router.post('/save', (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  let item = Object.assign(req.body)
  mainValidate.validator(req)
  let errors = req.validationErrors()
  let taskCurrent = (item !== 'undefined' && item.id !== '') ? 'edit' : 'add'
  if(Array.isArray(errors) && errors.length > 0) {
    let pageTitle = (taskCurrent == 'edit') ? pageTitleEdit : pageTitleAdd
    res.render(`${folderViewsAdmin}form`, { pageTitle, item, controllerName, errors});
  } else {
      mainModel.saveItem(item, {task: taskCurrent}).then(result => {
        usersModel.saveItem(item, {task: 'change-groups-name'}).then(result => {
          notifyHelpers.show(req, res, linkIndex, {task: taskCurrent})
    })
  })
}
})

//sort
router.get('/sort/:sort_field/:sort_type', function(req, res, next) {
req.session.sort_field = paramsHelpers.getParams(req.params, 'sort_field', 'ordering')
req.session.sort_type = paramsHelpers.getParams(req.params, 'sort_type', 'asc')

res.redirect(linkIndex)  
})
// List items
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
      params
    });
  })
  //change status
  router.post('/change-status/:id/:status', function(req, res, next) {
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    let id = paramsHelpers.getParams(req.params, 'id', '')
    mainModel.changeStatus(id, currentStatus, {task: "update-one"}).then(result => {
      res.send({status: (currentStatus === 'active') ? 'inactive' : 'active'})
    });  
  });
  //change status - multi 
  router.post('/change-status/:status', function(req, res, next) {
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    mainModel.changeStatus(req.body.cid, currentStatus, {task: "update-multi"}).then(result => {
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
  // delete - multi 
  router.post('/delete', function(req, res, next) {
    mainModel.deleteItem(req.body.cid, {task: 'delete-many'}).then(result => {
      notifyHelpers.show(req, res, linkIndex, {task: 'delete_multi', total: result.deletedCount})
    });  
  });
  //change ordering -   multi 
  router.post('/change-ordering', function(req, res, next) {
    let cids = req.body.cid
    let orderings = req.body.ordering
       mainModel.changeOdering(cids, orderings).then(result => {
        notifyHelpers.show(req, res, linkIndex, {task: 'change_ordering'})
     });      
    })
  });


//change groups_acp
router.post('/change-groups_acp/:id/:groups_acp', function(req, res, next) {
  let currentGroups_acp = paramsHelpers.getParams(req.params, 'groups_acp', 'yes')
  let id = paramsHelpers.getParams(req.params, 'id', '')
mainModel.groupsACP(id, currentGroups_acp).then(result => {
  res.send({groups_acp: (currentGroups_acp === 'yes') ? 'no' : 'yes' 
    })
  });  
});
module.exports = router;


