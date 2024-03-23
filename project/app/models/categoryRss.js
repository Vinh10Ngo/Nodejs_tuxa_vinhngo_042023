// const { notify } = require("../routes/backend/category")

const notifyConfigs = require(__path__configs + 'notify');

const mainModel = require(__path__schemas + 'categoryRss')
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
  }
}
