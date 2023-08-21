var express = require('express');
var router = express.Router ();

const util = require('util')
const itemsModel = require(__path__schemas + 'items')
const utilsHelpers = require(__path__helpers + 'utils')
const paramsHelpers = require(__path__helpers + 'params')
const validateItems = require(__path__validates + 'items')
const systemConfigs = require(__path__configs + 'system')
const notifyConfigs = require(__path__configs + 'notify');
const { resourceLimits } = require('worker_threads');
const linkIndex = '/' + systemConfigs.prefixAdmin + '/items/'

const pageTitleIndex = 'Book Manager::'
const pageTitleAdd = pageTitleIndex + 'Add'
const pageTitleEdit = pageTitleIndex + 'Edit'
const pageTitleList = pageTitleIndex + 'List'
const folderViews = __path__views + 'pages/items/'

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render(`${folderViews}login`, {pageTitle: 'Admin' });
});
router.get('/dashboard', async(req, res, next) => {
  let countItems = 0
  await itemsModel.count({}).then((data) => {
    countItems = data
  })
  res.render(`${folderViews}dashboard`, {
     pageTitle: 'Dashboard',
     countItems: countItems 
  });
});
//form
router.get('/form(/:id)?', function(req, res, next) {
  let id = paramsHelpers.getParams(req.params, 'id', '')
  let item =  {name: '', ordering: 0, status: 'novalue'}
  let errors = null
  if(id) {
    itemsModel.findById(id).then((item)=> {
      res.render(`${folderViews}form`, { pageTitle: pageTitleEdit, item: item, errors });
    })
  } else {
    res.render(`${folderViews}form`, { pageTitle: pageTitleAdd, item, errors });
  }
});

//ADD
router.post('/save', (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  validateItems.validator(req)
  let item = Object.assign(req.body)
  let errors = req.validationErrors()
  if(typeof item !== 'undefined' && item.id !== '') { //edit
if (errors) {
    res.render(`${folderViews}form`, { pageTitle: pageTitleEdit, item, errors});
  } else {
    itemsModel.updateOne({_id: item.id},
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
    res.render(`${folderViews}form`, { pageTitle: pageTitleAdd, item, errors});
  } else {
    item.created = {
      user_id: 0, 
      user_name: 'admin', 
      time: Date.now()
    }
    new itemsModel(item).save().then(() => {
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
// List items
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
  let statusFilter = await utilsHelpers.createFilterStatus(params.currentStatus)

  let sort = {}
  sort[params.sortField] = params.sortType

  if (params.currentStatus !== 'all') {
    objWhere.status = params.currentStatus
  }
  if (params.keyword !== '') {
    objWhere.name = new RegExp(params.keyword, 'i')
  }

  await itemsModel.count(objWhere).then((data) => {
    params.pagination.totalItems = data
  })
  itemsModel
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
      params
      // pagination,
      // currentStatus,
      // keyword,
      // sortField,
      // sortType
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
    itemsModel.updateOne({_id: id}, data).then(result => {
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
    itemsModel.updateMany({_id: {$in: req.body.cid}}, data).then(result => {
      req.flash('success', util.format(notifyConfigs.STATUS_MULTI_SUCCESS, result.matchedCount), false);
      res.redirect(linkIndex)
    });  
  });
  
  //delete
  router.get('/delete/:id/', function(req, res, next) {
    let id = paramsHelpers.getParams(req.params, 'id', '')
    itemsModel.deleteOne({_id: id}).then(result => {
      req.flash('success', notifyConfigs.DELETE_SUCCESS, false);
      res.redirect(linkIndex)
    });  
  });
  // delete - multi 
  router.post('/delete', function(req, res, next) {
    itemsModel.deleteMany({_id: {$in: req.body.cid}}).then(result => {
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
        itemsModel.updateOne({_id: item}, data).then(result => {
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
       itemsModel.updateOne({_id: cids}, data).then(result => {
     });      
    }
    req.flash('success', notifyConfigs.ORDERING_SUCCESS, false);
    res.redirect(linkIndex)
  });
});




module.exports = router;


