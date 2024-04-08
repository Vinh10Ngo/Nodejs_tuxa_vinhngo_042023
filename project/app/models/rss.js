  // const { notify } = require("../routes/backend/category")

  const notifyConfigs = require(__path__configs + 'notify');
  const paramsHelpers = require(__path__helpers + 'params')
  const utilsHelpers = require(__path__helpers + 'utils')
  const axios = require('axios')
  const xml2js = require('xml2js')

  const mainModel = require(__path__schemas + 'category-rss')
  var slug = require('slug')
  var print = console.log.bind(console, '')


  module.exports = {
      
      listItems: (params, options = null) => {
          let objWhere = {}
          let sort = {}
            if (params.currentStatus !== 'all') {
                objWhere.status = params.currentStatus
              }
            if (params.keyword !== '') {
              objWhere.name = new RegExp(params.keyword, 'i')
            }
          sort[params.sortField] = params.sortType

        return mainModel
          .find(objWhere)
          .select('name link status created modified')
          .sort(sort)
          .skip((params.pagination.currentPage-1)*params.pagination.totalItemsPerPage)
          .limit(params.pagination.totalItemsPerPage)
      }, 
      getItems: (id) => {
        return mainModel.findById(id)
      }, 
      countItems: (params, options = null) => {
        let objWhere = {}
        if (params.currentStatus !== 'all') {
          objWhere.status = params.currentStatus
        }
        if (params.keyword !== '') {
          objWhere.name = new RegExp(params.keyword, 'i')
        }
        return mainModel.count(objWhere)
      }, 
      changeStatus: (id, currentStatus, username, options = null) => {
          let status = (currentStatus === 'active') ? 'inactive' : 'active'
          let data = {
            status: status,
            modified : {
              user_id: 0, 
              user_name: username, 
              time: Date.now()   
          }
        }
        if(options.task == "update-one") {
          return mainModel.updateOne({_id: id}, data)
        }
        if(options.task == "update-multi") {
          data.status = currentStatus
          return mainModel.updateMany({_id: {$in: id}}, data)
        }       
      },
  
      deleteItem: (id, options = null) => {
      if(options.task == 'delete-one') {
        return mainModel.deleteOne({_id: id})
      }
      if(options.task == 'delete-many') {
        return mainModel.deleteMany({_id: {$in: id}})
      }
    },
    saveItem: (item, username, options = null) => {
      if (options.task == 'add') {
        item.created = {
          user_id: 0, 
          user_name: username, 
          time: Date.now()
        }
        return new mainModel(item).save()
      }
      if (options.task == 'edit') {
        return mainModel.updateOne({_id: item.id},
          {status: item.status, 
          name: item.name,
          link: item.link,
            modified : {
              user_id: 0, 
              user_name: username, 
              time: Date.now()   
          }
        })
      }
  },
    getItemsCondition: (params) => {
    return mainModel.find(params)
    }, 
    getArticleInCateogory: (id, category, article) => {
      if (!id || id == '') {
        return article
      } else {
        for (let i = 0; i < category.length; i++) {
          if (id == category[i].id) {
            return category[i].rss.channel.item
          } else {
            return []
          }
        }
      }
    },
    getEachArticle: (id, article) => {
      article.forEach((item) => {
        if (item.id == id) {
          return item
        } else {
          return 'Không có dữ liệu'
        }
      })
    },
    
    listItemArticleFrontend: async (req, obj, rssModel,articleRssFilterArrOutside, categoryRssEditedOutside) => {
      
      let articleRssTotalArr = []
      let categoryRssArr = [];
      obj.params = paramsHelpers.createParams(req)
      let items = await rssModel.getItemsCondition({})
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
          let categoryRssEdited = utilsHelpers.editCategoryRss(categoryRssArr)
          let articleRssTotalArrPushed = utilsHelpers.pushArticleRssTotalArr(categoryRssArr, articleRssTotalArr, categoryRssEdited)
          await utilsHelpers.saveArrToFile(articleRssTotalArrPushed, 'articleRss.json')
          const itemFromFile = await utilsHelpers.readFileJson('articleRss.json')
          // search keword và Filter theo Status 
          let articleRssFilterArr = []
          for (let i = 0; i < itemFromFile.length; i++) {
            const element = itemFromFile[i];
            if (element.title.includes(obj.params.keyword) || element.description.includes(obj.params.keyword)) {
                articleRssFilterArr.push(element);
            }
          } 
          obj.params.pagination.totalItemsPerPage = 10
          const startIndex = (obj.params.pagination.currentPage - 1) * obj.params.pagination.totalItemsPerPage;
          const endIndex = startIndex + obj.params.pagination.totalItemsPerPage;
          obj.params.pagination.totalItems = articleRssFilterArr.length
          articleRssFilterArr = articleRssFilterArr.slice(startIndex, endIndex);
          return { articleRssFilterArr, categoryRssEdited }; // Return both arrays as an object
          } catch (err) { 
          console.error('Lỗi khi xử lý các promise:', err);
          }
      }
      // Gọi hàm async để bắt đầu quá trình
      const { articleRssFilterArr, categoryRssEdited } = await processData();
        articleRssFilterArrOutside = articleRssFilterArr; // Assign the value
        categoryRssEditedOutside = categoryRssEdited; // Assign the value
        return { articleRssFilterArrOutside, categoryRssEditedOutside }
    }
  }
