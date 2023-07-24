var express = require('express');
var router = express.Router();

const itemsModel = require('../../schemas/items')
const utilsHelpers = require('../../helpers/utils')
const paramsHelpers = require('../../helpers/params')
const systemConfigs = require('./../../configs/system')
const linkIndex = '/' + systemConfigs.prefixAdmin + '/themes/'

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('themes/login', {pageTitle: 'Admin' });
});
router.get('/dashboard', function(req, res, next) {
  res.render('themes/dashboard', { pageTitle: 'Dashboard' });
});
router.get('/form', function(req, res, next) {
  res.render('themes/form', { pageTitle: 'Category Manager:: Add' });
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
      pageTitle: 'Book Manager:: List',
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
      res.redirect(linkIndex)
    });  
  });
  //change status - multi 
  router.post('/change-status/:status', function(req, res, next) {
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    itemsModel.updateMany({_id: {$in: req.body.cid}}, {status: currentStatus}).then(result => {
      res.redirect(linkIndex)
    });  
  });
  
  //delete
  router.get('/delete/:id/', function(req, res, next) {
    let id = paramsHelpers.getParams(req.params, 'id', '')
    itemsModel.deleteOne({_id: id}).then(result => {
      res.redirect(linkIndex)
    });  
  });
  // delete - multi 
  router.post('/delete', function(req, res, next) {
    itemsModel.deleteMany({_id: {$in: req.body.cid}}).then(result => {
      res.redirect(linkIndex)
    });  
  });
  //change ordering - multi 
  router.post('/change-ordering', function(req, res, next) {
    res.send(req.body) 
  });
});


module.exports = router;


