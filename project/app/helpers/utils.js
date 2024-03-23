const fs = require('fs');
const notifyConfigs = require(__path__configs + 'notify');
const path = require('path');

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

let countArticlesInCategory = async () => {
  const articleModel = require(__path__schemas + 'article')
  const allCategories = await articleModel.distinct('category'); // Lấy tất cả các category
  let countArr = []
  const maxCategories = 4; // Số lượng tối đa các category bạn muốn lấy

  // Nếu số lượng category lớn hơn maxCategories, sử dụng slice để giới hạn
  const categoriesToProcess = allCategories.length > maxCategories
    ? allCategories.slice(0, maxCategories)
    : allCategories
    for (const category of categoriesToProcess) {
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

let isNameshake = (oldNames, name) => {
  for (let i = 0; i < oldNames.length; i++) {
    if (oldNames[i].name === name) {
       return notifyConfigs.ERROR_NAMESHAKE
    }
  }
  return false
}
let isUserNameshake = (oldUserNames, username) => {
  for (let i = 0; i < oldUserNames.length; i++) {
    if (oldUserNames[i].username === username) {
       return notifyConfigs.ERROR_USERNAMESHAKE
    }
  }
  return false
}
let createFilterStatusRss = async (currentStatus, articleRssArr) => {
    let statusFilter = [
        {name:'all', value: 'all', count: 4, link: '#', class: 'default'},
        {name:'active', value: 'active', count: 5, link: '#', class: 'default'},
        {name:'inactive',value: 'inactive', count: 6, link: '#', class: 'default'}
      ]
    
        for (let index = 0; index < statusFilter.length; index ++) {
          let item = statusFilter[index] 
          if (item.value === currentStatus) statusFilter[index].class = 'success'
          if (item.value !== 'all') {
            statusFilter[index].count = articleRssArr.filter(ele => ele.status.includes(item.value)).length
          } else {
            statusFilter[index].count = articleRssArr.length
          }
        }
        return statusFilter
}
let idCounter = 1;
let generateId = (name) => {
  return `id_${name}_${idCounter++}`;
}
let pushItem = (arr, spreadArr) => {
  if (arr.length == 0) {
    arr.push(...spreadArr)
    return arr
  } else {
    for (let i = 0; i < arr.length; i++ ) {
      if (arr[i]) {
        return arr
      } else {
        arr.push(...spreadArr)
        return arr
      }
    }
  }
}

let saveArrToFile = (data) => {
  const jsonData = JSON.stringify(data);
  const filePath = path.join(__path__data, 'articleRss.json');

  fs.writeFile(filePath, jsonData, 'utf8', (err) => {
      if (err) {
          console.error('Error writing JSON file:', err);
      } else {
          console.log('JSON file has been saved');
      }
  });
}

let readFileJson = async () => {
   // Đường dẫn tuyệt đối hoặc tương đối đến tệp JSON
   const filePath = path.join(__path__data, 'articleRss.json');

   try {
       // Sử dụng fs.promises.readFile để đọc dữ liệu từ tệp JSON
       const data = await fs.promises.readFile(filePath, 'utf8');
       let jsonData = []
       // Phân tích cú pháp dữ liệu JSON
       if (data) jsonData = JSON.parse(data);
       return jsonData;
   } catch (error) {
       console.error('Lỗi khi đọc hoặc phân tích cú pháp dữ liệu JSON:', error);
       throw error; // Throw error để nó có thể được xử lý ở nơi gọi
   }
} 
module.exports = {
    createFilterStatus: createFilterStatus, 
    countArticlesInCategory: countArticlesInCategory,
    paginate: paginate,
    isNameshake: isNameshake,
    isUserNameshake,
    generateId,
    createFilterStatusRss,
    pushItem,
    saveArrToFile,
    readFileJson
    
}
