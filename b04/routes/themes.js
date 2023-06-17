var express = require('express');
var router = express.Router();

const itemsModel = require('./../schemas/items')

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('themes/login', {pageTitle: 'Admin' });
});
router.get('/dashboard', function(req, res, next) {
  res.render('themes/dashboard', { pageTitle: 'Dashboard' });
});


router.get('/list', function(req, res, next) {
  let statusFilter = [
    {name:'all', value: 'all', count: 4, link: '#', class: 'default'},
    {name:'active', value: 'active', count: 5, link: '#', class: 'default'},
    {name:'inactive',value: 'inactive', count: 6, link: '#', class: 'default'}
  ]

  statusFilter.forEach((item, index) => {
    let condition = {}
    if (item.value !== 'all') condition = {status: item.value};
    itemsModel.count(condition).then((data) => {
      statusFilter[index]= data
    })
  })

  itemsModel.find({}).then((items) => {
    res.render('themes/list', { 
      pageTitle: 'Book Manager:: List',
      items: items, 
      statusFilter: statusFilter,
    });
  })
});


router.get('/form', function(req, res, next) {
  res.render('themes/form', { pageTitle: 'Category Manager:: Add' });
});

module.exports = router;


