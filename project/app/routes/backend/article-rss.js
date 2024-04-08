var express = require('express');
var router = express.Router ();


const handleRssHelpers = require(__path__helpers + 'handle-rss')


router.get('(/:status)?', (req, res, next) => {
  handleRssHelpers.handleRss(req, res)
});



module.exports = router;


