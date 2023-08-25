var express = require('express');
var router = express.Router ();

const controllerName = 'users'
const util = require('util')
const usersModel = require(__path__schemas + controllerName)
const groupsModel = require(__path__schemas + 'groups')
const utilsHelpers = require(__path__helpers + 'utils')
const paramsHelpers = require(__path__helpers + 'params')
const validateUsers = require(__path__validates + controllerName)
const systemConfigs = require(__path__configs + 'system')
const notifyConfigs = require(__path__configs + 'notify');
const { resourceLimits } = require('worker_threads');
const linkIndex = '/' + systemConfigs.prefixAdmin + `/${controllerName}/`

const pageTitleIndex = 'Book Manager::'
const pageTitleAdd = pageTitleIndex + 'Add'
const pageTitleEdit = pageTitleIndex + 'Edit'
const pageTitleList = pageTitleIndex + 'List'
const folderViews = __path__views + `pages/${controllerName}/`

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render(`${folderViews}login`, {pageTitle: 'Admin' });
});
router.get('/dashboard', async(req, res, next) => {
  let countItems = 0
  await usersModel.count({}).then((data) => {
    countItems = data
  })
  res.render(`${folderViews}dashboard`, {
     pageTitle: 'Dashboard',
     countItems: countItems 
  });
});
//form
router.get('/form(/:id)?', async function(req, res, next) {
  let id = paramsHelpers.getParams(req.params, 'id', '')
  // let {id} = req.params
  let item =  {name: '', ordering: 0, status: 'novalue'}
  let errors = null
  let groupsItems = []
  await groupsModel.find({}, {_id: 1, name: 1}).then((item) => {
    groupsItems = item
    groupsItems.unshift({_id: 'novalue', name: 'Choose group'})
  })
  if(id !== '') {    //edit
    try {
      await usersModel.findById(id).then((item)=> {
      res.render(`${folderViews}form`, { pageTitle: pageTitleEdit, controllerName, item, errors, groupsItems });
    })   
    } catch (error) {
      console.log(error)
    }
  } else { // add
    res.render(`${folderViews}form`, { pageTitle: pageTitleAdd, controllerName, item, errors, groupsItems });
  }
});

//save
router.post('/save', async (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  validateUsers.validator(req)
  let item = Object.assign(req.body)
  let errors = req.validationErrors()
  if(typeof item !== 'undefined' && item.id !== '') { //edit
if (errors) {
  let groupsItems = []
  await groupsModel.find({}, {_id: 1, name: 1}).then((item) => {
    groupsItems = item
    groupsItems.unshift({_id: 'novalue', name: 'Choose group'})
    console.log(item)
  })
    res.render(`${folderViews}form`, { pageTitle: pageTitleEdit, item, controllerName, errors});
  } else {
    usersModel.updateOne({_id: item.id},
       {status: item.status, 
        ordering: parseInt(item.ordering),
        name: item.name,
        content: item.content,
          modified : {
            user_id: 0, 
            user_name: 'admin', 
            time: Date.now()   
        }
      }).then(result => {
      req.flash('success', notifyConfigs.EDIT_SUCCESS , false);
      res.redirect(linkIndex)
    }); 
  }

  } else { //add
  if (errors) {
    let groupsItems = []
  await groupsModel.find({}, {_id: 1, name: 1}).then((item) => {
    groupsItems = item
    groupsItems.unshift({_id: 'novalue', name: 'Choose group'})
  })
    res.render(`${folderViews}form`, { pageTitle: pageTitleAdd, item, controllerName, groupsItems, errors});
  } else {
    item.groups = {
      id: item.groups,
      name: item.groups_name
    }
    item.created = {
      user_id: 0, 
      user_name: 'admin', 
      time: Date.now()
    }
    new usersModel(item).save().then(() => {
      req.flash('success',notifyConfigs.ADD_SUCCESS, false);
      res.redirect(linkIndex)
    })
  } 
  }

})

//sort
router.get('/sort/:sort_field/:sort_type', function(req, res, next) {
req.session.sort_field = paramsHelpers.getParams(req.params, 'sort_field', 'ordering')
req.session.sort_type = paramsHelpers.getParams(req.params, 'sort_type', 'asc')

res.redirect(linkIndex)  
})
// List users
router.get('(/:status)?', async (req, res, next) => {
  let objWhere = {}
  let params = {}
  params.keyword = paramsHelpers.getParams(req.query, 'keyword', '')
  params.currentStatus = paramsHelpers.getParams(req.params, 'status', 'all')
  
  params.sortField = paramsHelpers.getParams(req.session, 'sort_field', 'ordering')
  params.sortType = paramsHelpers.getParams(req.session, 'sort_type', 'asc')
 
  params.pagination = {
    totalItems: 1,
    totalItemsPerPage : 3,
    pageRanges: 3,
    currentPage : parseInt(paramsHelpers.getParams(req.query, 'page', 1)) 
  } 
  let statusFilter = await utilsHelpers.createFilterStatus(params.currentStatus, controllerName)

  let sort = {}
  sort[params.sortField] = params.sortType

  if (params.currentStatus !== 'all') {
    objWhere.status = params.currentStatus
  }
  if (params.keyword !== '') {
    objWhere.name = new RegExp(params.keyword, 'i')
  }

  await usersModel.count(objWhere).then((data) => {
    params.pagination.totalItems = data
  })
  usersModel
  .find(objWhere)
  .select('name status ordering created modified')
  .sort(sort)
  .skip((params.pagination.currentPage-1)*params.pagination.totalItemsPerPage)
  .limit(params.pagination.totalItemsPerPage)
  .then((items) => {
    res.render(`${folderViews}list`, { 
      pageTitle: pageTitleList,
      items: items, 
      statusFilter: statusFilter,
      controllerName,
      params
    });
  })
  //change status
  router.get('/change-status/:id/:status', function(req, res, next) {
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    let id = paramsHelpers.getParams(req.params, 'id', '')
    let status = (currentStatus === 'active') ? 'inactive' : 'active'
    let data = {
      status: status,
      modified : {
        user_id: 0, 
        user_name: 'admin', 
        time: Date.now()   
    }
  }
    usersModel.updateOne({_id: id}, data).then(result => {
      req.flash('success', notifyConfigs.STATUS_SUCCESS, false);
      res.redirect(linkIndex)
    });  
  });
  //change status - multi 
  router.post('/change-status/:status', function(req, res, next) {
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    let data = {
      status: currentStatus,
      modified : {
        user_id: 0, 
        user_name: 'admin', 
        time: Date.now()   
    }
  }
    usersModel.updateMany({_id: {$in: req.body.cid}}, data).then(result => {
      req.flash('success', util.format(notifyConfigs.STATUS_MULTI_SUCCESS, result.matchedCount), false);
      res.redirect(linkIndex)
    });  
  });
  
  //delete
  router.get('/delete/:id/', function(req, res, next) {
    let id = paramsHelpers.getParams(req.params, 'id', '')
    usersModel.deleteOne({_id: id}).then(result => {
      req.flash('success', notifyConfigs.DELETE_SUCCESS, false);
      res.redirect(linkIndex)
    });  
  });
  // delete - multi 
  router.post('/delete', function(req, res, next) {
    usersModel.deleteMany({_id: {$in: req.body.cid}}).then(result => {
      req.flash('success', util.format(notifyConfigs.DELETE_MULTI_SUCCESS, result.deletedCount), false);
      res.redirect(linkIndex)
    });  
  });
  //change ordering - multi 
  router.post('/change-ordering', function(req, res, next) {
    let cids = req.body.cid
    let orderings = req.body.ordering
    
    if(Array.isArray(cids)) {
      cids.forEach((item, index) => {
        let data = {
          ordering: parseInt(orderings[index]),
          modified : {
            user_id: 0, 
            user_name: 'admin', 
            time: Date.now()   
        }
      }
        usersModel.updateOne({_id: item}, data).then(result => {
        }) 
      })  
    } else {
      let data = {
        ordering: parseInt(orderings),
        modified : {
          user_id: 0, 
          user_name: 'admin', 
          time: Date.now()   
      }
    }
       usersModel.updateOne({_id: cids}, data).then(result => {
     });      
    }
    req.flash('success', notifyConfigs.ORDERING_SUCCESS, false);
    res.redirect(linkIndex)
  });
});




module.exports = router;


