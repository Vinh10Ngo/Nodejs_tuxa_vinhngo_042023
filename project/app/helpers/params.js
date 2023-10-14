let getParams = (param, property, defaultValue) => {
  if(param.hasOwnProperty(property) && param[property] !== undefined) {
    return param[property]
  }
  return defaultValue
}
let createParams = (req) => {
  let params = {}
  params.keyword = getParams(req.query, 'keyword', '')
  params.currentStatus = getParams(req.params, 'status', 'all')
  
  params.sortField = getParams(req.session, 'sort_field', 'ordering')
  params.sortType = getParams(req.session, 'sort_type', 'asc')

  params.groupID = getParams(req.session, 'groups_id', '6527bab8f6e2544576c352c5')
 
  params.pagination = {
    totalItems: 1,
    totalItemsPerPage : 3,
    pageRanges: 3,
    currentPage : parseInt(getParams(req.query, 'page', 1)) 
  } 
  
  return params
}

module.exports = {
    getParams,
    createParams
}
