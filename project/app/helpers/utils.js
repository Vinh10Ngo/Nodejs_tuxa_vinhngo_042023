
let createFilterStatus = async (currentStatus, collection) => {
  const currentModel = require(__path__schemas + collection)
    let statusFilter = [
        {name:'all', value: 'all', count: 4, link: '#', class: 'default'},
        {name:'active', value: 'active', count: 5, link: '#', class: 'default'},
        {name:'inactive',value: 'inactive', count: 6, link: '#', class: 'default'}
      ]
    
        for (let index = 0; index < statusFilter.length; index ++) {
        let item = statusFilter[index] 
        let condition = (item.value !== 'all') ? {status: item.value} : {} 
        if (item.value === currentStatus) statusFilter[index].class = 'success'

        await currentModel.count(condition).then((data) => {
          statusFilter[index].count = data
        })
      }
      return statusFilter
}

let countArticlesInCategory = async (category) => {
  const articleModel = require(__path__schemas + 'article')
  const allCategories = await articleModel.distinct('category'); // Lấy tất cả các category
  let countArr = []
    for (const category of allCategories) {
        const count = await articleModel.countDocuments({category: category });
        countArr.push({ category: category, count: count });
    }
    return countArr
}

let paginate = (pageNumber, totalPages, pageRange) => {
  const delta = Math.floor(pageRange / 2);
  let start = Math.max(1, pageNumber - delta);
  let end = Math.min(totalPages, start + pageRange - 1);

  if (totalPages - end < delta && start > 1) {
      start = Math.max(1, start - (delta - (totalPages - end)) - 1);
      end = Math.min(totalPages, start + pageRange - 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
      pages.push(i);
  }

  return { start, end, pages };
}



module.exports = {
    createFilterStatus: createFilterStatus, 
    countArticlesInCategory: countArticlesInCategory,
    paginate: paginate,
    
}
