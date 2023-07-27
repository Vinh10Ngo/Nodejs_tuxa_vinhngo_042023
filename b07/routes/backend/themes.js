var express = require('express');
var router = express.Router();

const itemsModel = require('../../schemas/items')
const utilsHelpers = require('../../helpers/utils')
const paramsHelpers = require('../../helpers/params')
const systemConfigs = require('./../../configs/system')
const linkIndex = '/' + systemConfigs.prefixAdmin + '/themes/'

const pageTitleIndex = 'Book Manager::'
const pageTitleAdd = pageTitleIndex + 'Add'
const pageTitleEdit = pageTitleIndex + 'Edit'

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('themes/login', {pageTitle: 'Admin' });
});
router.get('/dashboard', async(req, res, next) => {
  let countItems = 0
  await itemsModel.count({}).then((data) => {
    countItems = data
  })
  res.render('themes/dashboard', {
     pageTitle: 'Dashboard',
     countItems: countItems 
  });
});
router.get('/form(/:id)?', function(req, res, next) {
  console.log(req.params.id)
  let id = paramsHelpers.getParams(req.params, 'id', '')
  if(id) {
    res.render('themes/form', { pageTitle: pageTitleEdit });
  } else {
    res.render('themes/form', { pageTitle: pageTitleAdd });
  }

});
// List themes
router.get('(/:status)?', function(req, res, next) {
  let objWhere = {}
  let keyword = paramsHelpers.getParams(req.query, 'keyword', '')
  console.log(keyword)
  let currentStatus = paramsHelpers.getParams(req.params, 'status', 'all')
  let statusFilter = utilsHelpers.createFilterStatus(currentStatus)
  let pagination = {
    totalItems: 1,
    totalItemsPerPage : 3,
    pageRanges: 3,
    currentPage : parseInt(paramsHelpers.getParams(req.query, 'page', 1)) 
  } 

  if(currentStatus === 'all') {
    if(keyword !== '') objWhere = {name: new RegExp(keyword, 'i')}
  } else {
    objWhere = {status: currentStatus, name: new RegExp(keyword, 'i')}
  }
  itemsModel.count(objWhere).then((data) => {
    pagination.totalItems = data
    itemsModel
  .find(objWhere)
  .sort({ordering: 'asc'})
  .skip((pagination.currentPage-1)*pagination.totalItemsPerPage)
  .limit(pagination.totalItemsPerPage)
  .then((items) => {
    res.render('themes/list', { 
      pageTitle: pageTitleIndex,
      items: items, 
      statusFilter: statusFilter,
      pagination,
      currentStatus,
      keyword
    });
  })
  })
  //change status
  router.get('/change-status/:id/:status', function(req, res, next) {
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    let id = paramsHelpers.getParams(req.params, 'id', '')
    let status = (currentStatus === 'active') ? 'inactive' : 'active'
    itemsModel.updateOne({_id: id}, {status: status}).then(result => {
      req.flash('success', 'Cập nhập status thành công!', false);
      res.redirect(linkIndex)
    });  
  });
  //change status - multi 
  router.post('/change-status/:status', function(req, res, next) {
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    itemsModel.updateMany({_id: {$in: req.body.cid}}, {status: currentStatus}).then(result => {
      console.log(result)
      req.flash('success', `Cập nhập ${result.matchedCount} status thành công!`, false);
      res.redirect(linkIndex)
    });  
  });
  
  //delete
  router.get('/delete/:id/', function(req, res, next) {
    let id = paramsHelpers.getParams(req.params, 'id', '')
    itemsModel.deleteOne({_id: id}).then(result => {
      req.flash('success', 'Xóa thành công!', false);
      res.redirect(linkIndex)
    });  
  });
  // delete - multi 
  router.post('/delete', function(req, res, next) {
    itemsModel.deleteMany({_id: {$in: req.body.cid}}).then(result => {
      req.flash('success', `Xóa ${result.matchedCount} phần tử thành công!`, false);
      res.redirect(linkIndex)
    });  
  });
  //change ordering - multi 
  router.post('/change-ordering', function(req, res, next) {
    let cids = req.body.cid
    let orderings = req.body.ordering
    if(Array.isArray(cids)) {
      cids.forEach((item, index) => {
        itemsModel.updateOne({_id: item}, {ordering: parseInt(orderings[index])}).then(result => {
          req.flash('success', `Thay đổi ordering ${result.matchedCount} phần tử thành công!`, false);
        })    
      })
    } else {
      itemsModel.updateOne({_id: cids}, {ordering: parseInt(orderings)}).then(result => {
        req.flash('success', 'Thay đổi ordering thành công!', false);
     });      
    }
    res.redirect(linkIndex)
  });
});


module.exports = router;


