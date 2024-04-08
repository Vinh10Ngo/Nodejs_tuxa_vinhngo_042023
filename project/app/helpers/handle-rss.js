const paramsHelpers = require(__path__helpers + 'params')
const axios = require('axios')
const xml2js = require('xml2js')

const utilsHelpers = require(__path__helpers + 'utils')
const controllerName = 'articleRss'
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`
const pageTitleIndex = 'ArticleRss Manager::' 
const pageTitleList = pageTitleIndex + 'List'

const categoryRssModel = require(__path__models + 'rss')
let articleRssTotalArr = []
let categoryRssArr = [];
module.exports = {
    handleRss: async (req, res) => {
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
                let categoryRssEdited = utilsHelpers.editCategoryRss(categoryRssArr)
                let articleRssTotalArrPushed = utilsHelpers.pushArticleRssTotalArr(categoryRssArr, articleRssTotalArr)
                await utilsHelpers.saveArrToFile(articleRssTotalArrPushed, 'articleRss.json')
                const itemFromFile = await utilsHelpers.readFileJson('articleRss.json')

                // search keword và Filter theo Status 
                articleRssFilterArr = itemFromFile.filter(element => {
                    return (element => element.title.includes(params.keyword) || element.description.includes(params.keyword))
                })
                const startIndex = (params.pagination.currentPage - 1) * params.pagination.totalItemsPerPage;
                const endIndex = startIndex + params.pagination.totalItemsPerPage;
                params.pagination.totalItems = articleRssFilterArr.length
                articleRssFilterArr = articleRssFilterArr.slice(startIndex, endIndex);
                res.render(`${folderViewsAdmin}list`, {
                    pageTitle: pageTitleList,
                    controllerName,
                    params,
                    categoryRssEdited,
                    articleRssFilterArr
                });
                } catch (err) { 
                console.error('Lỗi khi xử lý các promise:', err);
                }
            }
            
            // Gọi hàm async để bắt đầu quá trình
            processData(); 
        })
    }
}