var slug = require('slug')
var print = console.log.bind(console, '')
let slugText = (text) => {
  // Giả sử hàm slug trả về slug từ văn bản text
  let generatedSlug = slug(text);
  return generatedSlug;
}
      

module.exports = {
  slugText 
}
