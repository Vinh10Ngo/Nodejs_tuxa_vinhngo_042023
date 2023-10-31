var express = require('express');
var router = express.Router();

const folderViewsBlog = __path__views__blog + 'pages/home/'
// const layoutBlog = __path__views__blog + 'frontend'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(`${folderViewsBlog}index`);
});


module.exports = router;
