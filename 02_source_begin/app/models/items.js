const MainModel 	= require(__path_schemas + 'items');


module.exports = {
    listItems: (params, options = null) => {
        let sort = {}
        let objWhere = {}
        if (params.keyword !== '') objWhere.name = new RegExp(params.keyword, 'i')
        if (params.sortField) sort[params.sortField] =  params.sortType

        if (options.task == 'all') {
            return MainModel.find(objWhere).select('name status').sort(sort)
        }
        if (options.task == 'one') {
            return MainModel.findById(params.id).select('name status')
        }
    },
    create: (item) => {
        return new MainModel(item).save()
    },
    deleteItems: (params, options = null) => {
        if (options.task == 'one') {
            return MainModel.deleteOne({_id: params.id})
        }
    },
    editItems: (params, options = null) => {
        if (options.task == 'edit') {
            return MainModel.updateOne({_id: params.id}, params.body)
        }
    }
}