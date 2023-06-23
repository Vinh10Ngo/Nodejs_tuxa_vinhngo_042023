var express = require('express');
var router = express.Router();

const itemsModel = require('../../schemas/items')
const utilsHelpers = require('../../helpers/utils')
const paramsHelpers = require('../../helpers/params')

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

router.get('(/:status)?', function(req, res, next) {
  let objWhere = {}
  let keyword = paramsHelpers.getParams(req.query, 'keyword', '')
  console.log(keyword)
  let currentStatus = paramsHelpers.getParams(req.params, 'status', 'all')
  let statusFilter = utilsHelpers.createFilterStatus(currentStatus)
  if(currentStatus === 'all') {
    if(keyword !== '') objWhere = {name: new RegExp(keyword, 'i')}
  } else {
    objWhere = {status: currentStatus, name: new RegExp(keyword, 'i')}
  }
  
  itemsModel.find(objWhere).then((items) => {
    res.render('themes/list', { 
      pageTitle: 'Book Manager:: List',
      items: items, 
      statusFilter: statusFilter,
      currentStatus,
      keyword
    });
  })
 
});

module.exports = router;


