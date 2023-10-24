var express = require('express');
var router = express.Router ();

const multer  = require('multer')
const fs  = require('fs')

const controllerName = 'users'
const mainModel = require(__path__models + controllerName)
const groupsModel = require(__path__models + 'users')
const fileHelpers  = require(__path__helpers + 'file')
const utilsHelpers = require(__path__helpers + 'utils')
const paramsHelpers = require(__path__helpers + 'params')
const existHelpers = require(__path__helpers + 'exist')
const mainValidate = require(__path__validates + controllerName)
const systemConfigs = require(__path__configs + 'system')
const notifyHelpers = require(__path__helpers + 'notify')
const notifyConfigs = require(__path__configs + 'notify')

const { resourceLimits } = require('worker_threads');
const linkIndex = '/' + systemConfigs.prefixAdmin + `/${controllerName}/`

const pageTitleIndex = 'Book Manager::'
const pageTitleAdd = pageTitleIndex + 'Add'
const pageTitleEdit = pageTitleIndex + 'Edit'
const pageTitleList = pageTitleIndex + 'List'
const folderViews = __path__views + `pages/${controllerName}/`
const uploadFileName = fileHelpers.uploadFile('filename')
const uploadAvatar = fileHelpers.uploadFile('avatar')

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render(`${folderViews}login`, {pageTitle: 'Admin' });
});
router.get('/dashboard', async(req, res, next) => {
  let countItems = 0
  await mainModel.count({}).then((data) => {
    countItems = data
  })
  res.render(`${folderViews}dashboard`, {
     pageTitle: 'Dashboard',
     countItems: countItems 
  });
});

// Test upload form

router.get('/upload', function(req, res, next) {
  let errors = null
  res.render(`${folderViews}upload`, { pageTitle: pageTitleIndex, controllerName, errors})
})
router.post('/upload', function(req, res, next) {
  uploadFileName(req, res, function (err) {
    let errors = []
    if (err instanceof multer.MulterError) {
    } else if (err) {
      errors.push({param: 'avatar', msg: err})
    } 
    res.render(`${folderViews}upload`, { pageTitle: pageTitleIndex, controllerName, errors})
  })
})

//form
router.get('/form(/:id)?', async function(req, res, next) {
  let id = paramsHelpers.getParams(req.params, 'id', '')
  let item =  {name: '', ordering: 0, status: 'novalue', groups_id: '', groups_name: '', content: ''}
  let errors = null
  // truyền groupsItems ra ngoài
  let groupsItems = []
  await groupsModel.listItemInSelectBox().then((item) => {
    groupsItems = item
    groupsItems.unshift({_id: 'novalue', name: 'Choose group'})
  })
  if(id !== '') {
  mainModel.getItems(id).then((item)=> {
    item.groups_id = item.groups.id
    item.groups_name = item.groups.name
    res.render(`${folderViews}form`, { pageTitle: pageTitleEdit, controllerName, item, errors, groupsItems });
  })
  } else {
    res.render(`${folderViews}form`, { pageTitle: pageTitleAdd, controllerName, item, errors, groupsItems });
  }
});


//SAVE
router.post('/save', (req, res, next) => {
  uploadAvatar (req, res, async (err) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = Object.assign(req.body)
    item.avatar = (req.file == undefined) ? null : req.file.filename
    let taskCurrent = (item !== undefined && item.id !== '') ? 'edit' : 'add'
    let errors = mainValidate.validator(req, item, err, taskCurrent)

    if(Array.isArray(errors) && errors.length > 0) {
      let groupsItems = []     
      await groupsModel.listItemInSelectBox().then((item) => {
        groupsItems = item
        groupsItems.unshift({_id: 'novalue', name: 'Choose group'})
      })
      fileHelpers.remove('public/uploads/users/', item.avatar)
      if(taskCurrent == 'edit') item.avatar = item.image_old
      console.log(item.avatar);
      let pageTitle = (taskCurrent == 'edit') ? pageTitleEdit : pageTitleAdd
      res.render(`${folderViews}form`, { pageTitle, item, controllerName, errors, groupsItems});
    } else {
      // item.avatar = (req.file == undefined) ? null : req.file.filename
        if (req.file == undefined) {
          item.avatar = item.image_old
        } else {
          item.avatar = req.file.filename
          if (taskCurrent == 'edit') fileHelpers.remove('public/uploads/users/', item.image_old)
        }
        mainModel.saveItem(item, {task: taskCurrent}).then(result => {
          notifyHelpers.show(req, res, linkIndex, {task: taskCurrent})
        })
      }
  }) 
})

//sort
router.get('/sort/:sort_field/:sort_type', function(req, res, next) {
req.session.sort_field = paramsHelpers.getParams(req.params, 'sort_field', 'ordering')
req.session.sort_type = paramsHelpers.getParams(req.params, 'sort_type', 'asc')

res.redirect(linkIndex)  
})
// filter groups
router.get('/filter-groups/:groups_id', function(req, res, next) {
  // lấy groups_id được truyền qua, lưu vào session với giá trị là groups_id
  req.session.groups_id = paramsHelpers.getParams(req.params, 'groups_id', '')
  // trả về linkIndex rơi vào trường hợp (/:status)?
  res.redirect(linkIndex)  
  })
// List items
router.get('(/:status)?', async (req, res, next) => {
  let params = paramsHelpers.createParams(req)
  let statusFilter = await utilsHelpers.createFilterStatus(params.currentStatus, controllerName)
  let groupsItems = []
  await mainModel.countItems(params).then((data) => {
    params.pagination.totalItems = data

  })
  await groupsModel.listItemInSelectBox().then((item) => {
    groupsItems = item
    // groupsItems.push({_id: 'novalue', name: 'no group'})
  }) 
  mainModel
  .listItems(params)
  .then((items) => {
    res.render(`${folderViews}list`, { 
      pageTitle: pageTitleList,
      items: items, 
      statusFilter: statusFilter,
      controllerName,
      groupsItems,
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
  // change group
  router.post('/change-group', function(req, res, next) {
   let id = req.body.id
   let groupID = req.body.groups_id
   let groupName = req.body.groups_name
   mainModel.changeGroup(id, groupID, groupName).then(result => {
    res.send({})
    });
  })
  
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
module.exports = router;


