var express = require('express');
var router = express.Router ();
const axios = require('axios')
const xml2js = require('xml2js')


const controllerName = 'articleRss'
const paramsHelpers = require(__path__helpers + 'params')
const utilsHelpers = require(__path__helpers + 'utils')
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`
const pageTitleIndex = 'ArticleRss Manager::' 
const pageTitleList = pageTitleIndex + 'List'

const categoryRssModel = require(__path__models + 'categoryRss')
let articleRssTotalArr = []

router.get('(/:status)?', async (req, res, next) => {
  let categoryRssArr = [];
  let params = paramsHelpers.createParams(req)
  categoryRssModel.getItemsCondition({}).then((items) => {
    let promises = [];
    items.forEach((item, index) => {
      let promise = axios.get(item.link)
        .then(response => {
          return new Promise((resolve, reject) => {
            xml2js.parseString(response.data, { explicitArray: false }, (err, result) => {
              if (err) {
                reject(err);
              } else {
                categoryRssArr.push(result);
                resolve(result);
              }
            });
          });
        })
        .catch(error => {
          console.error('Lỗi khi gửi yêu cầu:', error);
        });
      promises.push(promise);
    });
      async function processData() {
        try {
          // Sử dụng Promise.all để đợi tất cả các promise hoàn thành
          await Promise.all(promises);
          
          // Xử lý dữ liệu bất đồng bộ
          const categoryRss = categoryRssArr.map((item, index) => {
            return {
              name: item.rss.channel.title,
              id: utilsHelpers.generateId('category')
            };
          });
          categoryRssArr.forEach((item, index) => {
            if (!item.rss.channel.item) {
              item.rss.channel.item = []
            }
            
            articleRssTotalArr = utilsHelpers.pushItem(articleRssTotalArr, item.rss.channel.item)
            articleRssTotalArr = articleRssTotalArr.map((item, index) => {
              return {...item, status: 'active', id: utilsHelpers.generateId('article_rss')}
            })
          })
          const itemFromFile = await utilsHelpers.readFileJson()
          if (itemFromFile.length == 0) {
            await utilsHelpers.saveArrToFile(articleRssTotalArr)
          } else {
            for (let i = 0; i < itemFromFile.length; i ++) {
              if (!itemFromFile[i].id) { // nếu không có id ở vị trí i
                articleRssTotalArr.push(itemFromFile[i]) // push phần tử ở vị trí i            
              } else {
                articleRssTotalArr = articleRssTotalArr.map(item => {
                  return {...item, status: itemFromFile[i].status}
                })
              }
            }
            await utilsHelpers.saveArrToFile(articleRssTotalArr)
          }
          const itemFromFileAfter = await utilsHelpers.readFileJson()
          // statusFilter
          const statusFilter = await utilsHelpers.createFilterStatusRss(params.currentStatus, itemFromFileAfter) 
          // search keword và Filter theo Status 
          articleRssFilterArr = itemFromFileAfter.filter(element => {
            if (params.currentStatus == 'all') {
              return (element => element.title.includes(params.keyword) || element.description.includes(params.keyword))
            } else {
              return (element => element.title.includes(params.keyword) || element.description.includes(params.keyword)) && element.status.includes(params.currentStatus)
            }
          })
          const startIndex = (params.pagination.currentPage - 1) * params.pagination.totalItemsPerPage;
          const endIndex = startIndex + params.pagination.totalItemsPerPage;
          params.pagination.totalItems = articleRssFilterArr.length
          articleRssFilterArr = articleRssFilterArr.slice(startIndex, endIndex);
          res.render(`${folderViewsAdmin}list`, {
            pageTitle: pageTitleList,
            controllerName,
            params,
            categoryRss,
            statusFilter,
            articleRssFilterArr
          });
        } catch (err) { 
          console.error('Lỗi khi xử lý các promise:', err);
        }
      }
      
    // Gọi hàm async để bắt đầu quá trình
    processData();   
  })
  // filter category
  router.get('/filter-category_Rss/:category_id', function(req, res, next) {
    // lấy category_id được truyền qua, lưu vào session với giá trị là category_id
    req.session.category_id = paramsHelpers.getParams(req.params, 'category_id', '')
    // trả về linkIndex rơi vào trường hợp (/:status)?
    res.redirect(linkIndex)  
  })
  //  // change category
  //  router.post('/change-category', function(req, res, next) {
  //   let id = req.body.id
  //   let username = 'phucvinh'
  //   let categoryID = req.body.category_id
  //   let categoryName = req.body.category_name
  //   // mainModel.changecategory(id, categoryID, categoryName, username).then(result => {
  //   //  res.send({})  
  //   //  });
  //  })
  router.post('/change-status/:id/:status', async function(req, res, next) {
    console.log('abc');
    // let id = paramsHelpers.getParams(req.params, 'id', '')
    // let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    // let changeStatus = (currentStatus === 'active') ? 'inactive' : 'active' 
    // let articleRssTotalChangStatusArr = articleRssTotalArr.map((ele) => {
    //   if (ele.id === id) {
    //     // Thay đổi giá trị của trường status
    //     return { ...ele, status: changeStatus };
    //   }
    //   return ele;
    // }) // click lần 1 => iat => at => saveArrToFile at
    // await utilsHelpers.saveArrToFile(articleRssTotalChangStatusArr) 
    // res.send({status: (currentStatus === 'active') ? 'inactive' : 'active'}) 
  });
});
 
module.exports = router;


