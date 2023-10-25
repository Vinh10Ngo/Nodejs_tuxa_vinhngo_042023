const mainModel = require(__path__schemas + 'article')
const categoryModel = require(__path__schemas + 'category')
const notifyConfigs = require(__path__configs + 'notify');
const fileHelpers  = require(__path__helpers + 'file')
const uploadLink = 'public/uploads/article/'

module.exports = {
    
    listItems: (params, options = null) => {
      let objWhere = {}
        let sort = {}
        if (params.currentStatus !== 'all') {
          objWhere.status = params.currentStatus
        }

        if (params.categoryID !== 'allvalue')  objWhere['category.id'] = params.categoryID  

        if (params.keyword !== '') {
          objWhere.name = new RegExp(params.keyword, 'i')
        }
         sort[params.sortField] = params.sortType
       return mainModel
        .find(objWhere)
        .select('name status ordering created modified category.name category.id thumb special')
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
      if (params.categoryID !== 'allvalue') {
        objWhere['category.id'] = params.categoryID
      }
      if (params.keyword !== '') {
        objWhere.name = new RegExp(params.keyword, 'i')
      }
       return mainModel.count(objWhere)
    }, 
    changeStatus: (id, currentStatus, options = null) => {
        let status = (currentStatus === 'active') ? 'inactive' : 'active'
        let data = {
          status: status,
          modified : {
            user_id: 0, 
            user_name: 'admin', 
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
    changeOdering: async (cids, orderings, options = null) => {
        let data = {
            ordering: parseInt(orderings),
            modified : {
              user_id: 0, 
              user_name: 'admin', 
              time: Date.now()   
          }
        }
        if(Array.isArray(cids)) {
            for (let index = 0; index < cids.length; index++) {
              data.ordering = parseInt(orderings[index])  
              await mainModel.updateOne({_id: cids[index]}, data)
              return Promise.resolve('Success')
            }
          } else {
              return mainModel.updateOne({_id: cids}, data)
          }
    },
    changeOrderingAjax: (id, ordering, option = null) => {
      let data = {
        ordering: parseInt(ordering),
        modified : {
          user_id: 0, 
          user_name: 'admin', 
          time: Date.now()   
      }
    }
    return mainModel.updateOne({_id: id}, data)
    },
    deleteItem: async (id, options = null) => {
     if(options.task == 'delete-one') {
        await mainModel.findById(id).then(result => {
          fileHelpers.remove(uploadLink, result.thumb)
    }); 
      return mainModel.deleteOne({_id: id})
     }
     if(options.task == 'delete-many') {
      if (Array.isArray(id)) {
        for (let index = 0; index < id.length; index++) {
          await mainModel.findById(id[index]).then(result => {
            fileHelpers.remove(uploadLink, result.thumb)  
          }); 
        }
      } else {
        await mainModel.findById(id).then(result => {
          fileHelpers.remove(uploadLink, result.thumb)     
        }); 
      }
      return mainModel.deleteMany({_id: {$in: id}})
     }
  },
  saveItem: (item, options = null) => {
    if (options.task == 'add') {
      item.category = {
        id: item.category_id,
        name: item.category_name
      }
      item.created = {
        user_id: 0, 
        user_name: 'admin', 
        time: Date.now()
      }
      return new mainModel(item).save()
    }
    if (options.task == 'edit') {
      return mainModel.updateOne({_id: item.id},
        {status: item.status, 
         ordering: parseInt(item.ordering),
         name: item.name,
         thumb: item.thumb,
         special: item.special,
         content: item.content,
         category: {
          id: item.category_id,
          name: item.category_name
        },
           modified : {
             user_id: 0, 
             user_name: 'admin', 
             time: Date.now()   
         }
       })
    }
    if (options.task == 'change-category-name') {
      return mainModel.updateMany({'category.id': item.id},
        {
         category: {
          id: item.id,
          name: item.name
        },
        modified : {
          user_id: 0, 
          user_name: 'admin', 
          time: Date.now()   
        }
       })
    }
  },
  listItemInSelectBox: (params, option = null) => {
    return categoryModel.find({}, {_id: 1, name: 1})
  },
  changecategory: (id, categoryID, categoryName) => {
    return mainModel.updateOne({_id: id}, {
      category: {
        id: categoryID,
        name: categoryName
      },
      modified : {
        user_id: 0, 
        user_name: 'admin', 
        time: Date.now()   
      }
    })    
  },
  special: (id, currentSpecial, options = null) => {
    let special = (currentSpecial === 'yes') ? 'no' : 'yes'
    let data = {
      special: special,
      modified : {
        user_id: 0, 
        user_name: 'admin', 
        time: Date.now()   
    }
  }
    return mainModel.updateOne({_id: id}, data)
  },
}
