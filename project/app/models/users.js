const mainModel = require(__path__schemas + 'users')
const groupsModel = require(__path__schemas + 'groups')
const notifyConfigs = require(__path__configs + 'notify');

module.exports = {
    
    listItems: (params, options = null) => {
      let objWhere = {}
        let sort = {}
        if (params.currentStatus !== 'all') {
          objWhere.status = params.currentStatus
        }
        if (params.groupID !== 'allvalue') {
          objWhere['groups.id'] = params.groupID
        }
        if (params.keyword !== '') {
          objWhere.name = new RegExp(params.keyword, 'i')
        }
         sort[params.sortField] = params.sortType
       return mainModel
        .find(objWhere)
        .select('name status ordering created modified groups.name')
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
      if (params.groupID !== 'allvalue') {
        objWhere['groups.id'] = params.groupID
      }
      if (params.keyword !== '') {
        objWhere.name = new RegExp(params.keyword, 'i')
      }
       return mainModel.count(objWhere)
    }, 
    changeStatus: async (id, currentStatus, options = null) => {
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
        let result = {
          id, status, notify: {'tilte': notifyConfigs.STATUS_SUCCESS, 'class': 'success'}
        }
        await mainModel.updateOne({_id: id}, data)
        return result
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
    deleteItem: (id, options = null) => {
     if(options.task == 'delete-one') {
      return mainModel.deleteOne({_id: id})
     }
     if(options.task == 'delete-many') {
      return mainModel.deleteMany({_id: {$in: id}})
     }
  },
  saveItem: (item, options = null) => {
    if (options.task == 'add') {
      item.groups = {
        id: item.groups_id,
        name: item.groups_name
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
         content: item.content,
         groups: {
          id: item.groups_id,
          name: item.groups_name
        },
           modified : {
             user_id: 0, 
             user_name: 'admin', 
             time: Date.now()   
         }
       })
    }
    if (options.task == 'change-groups-name') {
      return mainModel.updateMany({'groups.id': item.id},
        {
         groups: {
          id: item.id,
          name: item.name
        },
       })
    }
 },
  listItemInSelectBox: (params, option = null) => {
    return groupsModel.find({}, {_id: 1, name: 1})
 },
}
