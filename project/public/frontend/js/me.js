const uploadPath = '/uploads/article/'
function formatTime(fulltime) {
  const date = new Date(fulltime);

  const day = date.getDate();
  const month = date.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate
}

$('.category-hover').hover(function() {
  let link = $(this).data('link')
  let linkPrefix = $(this).data('link-prefix')

  $.ajax({
      type: 'GET',
      url: link, // Đường dẫn tới API endpoint của server
      success: function(response) {
        let articlesHTML = '';
        response.forEach(function(article) {
          let FormattedTime = formatTime(article.created.time)
          articlesHTML +=  
          `<div class="col-3">
          <div>
              <a href="/${linkPrefix}/blog-detail/${article._id}" class="wrap-pic-w hov1 trans-03">
                  <img src="${uploadPath + article.thumb}" alt="IMG">
              </a>
  
              <div class="p-t-10">
                  <h5 class="p-b-5">
                      <a href="blog-detail-01.html" class="f1-s-5 cl3 hov-cl10 trans-03">
                          ${article.name}
                      </a>
                  </h5>
  
                  <span class="cl8">
                      <a href="/${linkPrefix}/category/${article.category.id}" class="f1-s-6 cl8 hov-cl10 trans-03">
                      ${article.category.name}
                      </a>
  
                      <span class="f1-s-3 m-rl-3">
                          -
                      </span>
  
                      <span class="f1-s-3">
                      ${FormattedTime}
                      </span>
                  </span>
              </div>
          </div>
      </div>`
         });
        $('.article-list').html(articlesHTML);
      },
      error: function() {
        console.log('Đã xảy ra lỗi khi tải dữ liệu.');
      }
    });
  }, function() {
    $('.article-list').empty();
  });
  


const colors = ['red', 'blue', 'green', 'yellow']; // Mảng chứa các màu

const items = document.querySelectorAll('.tab01-title'); // Lấy danh sách các phần tử cần áp dụng màu

items.forEach((item, index) => {
  item.style.color = colors[index % colors.length]; // Áp dụng màu từ mảng colors theo vòng lặp
});

$('.category-list').each(function() {
  let linkPrefix = $(this).data('link-prefix')
  let dataLink = $(this).data('link') 
  let categoryContainer = $(this).find('.article-in-category'); 
  $.ajax({
  type: 'GET',
  url: dataLink ,
  success: function(response) {
     let articlesHtml1 = 
      `<div class="col-sm-6 p-r-25 p-r-15-sr991">
      <div class="m-b-30">
          <a href="/${linkPrefix}/blog-detail/${response[0]._id}" class="wrap-pic-w hov1 trans-03">
              <img src="${uploadPath + response[0].thumb}" alt="IMG">
          </a>

          <div class="p-t-20">
              <h5 class="p-b-5">
                  <a href="/${linkPrefix}/blog-detail/${response[0]._id}" class="f1-m-3 cl2 hov-cl10 trans-03">
                      ${response[0].name} 
                  </a>
              </h5>

              <span class="cl8">
                  <a href="/${linkPrefix}/category/${response[0].category.id}" class="f1-s-4 cl8 hov-cl10 trans-03">
                  ${response[0].category.name}
                  </a>

                  <span class="f1-s-3 m-rl-3">
                      -
                  </span>

                  <span class="f1-s-3">
                  ${formatTime(response[0].created.time)}
                  </span>
              </span>
          </div>
      </div>
  </div>` 
    let articlesHtmlI = '<div class="col-sm-6 p-r-25 p-r-15-sr991">'
    for (let i = 1; i < response.length; i++) { 
        articlesHtmlI +=
  ` <div class="flex-wr-sb-s m-b-30">
          <a href="/${linkPrefix}/blog-detail/${response[i]._id}" class="size-w-1 wrap-pic-w hov1 trans-03">
              <img src="${uploadPath + response[i].thumb}" alt="IMG">
          </a>

          <div class="size-w-2">
              <h5 class="p-b-5">
                  <a href="/${linkPrefix}/blog-detail/${response[i]._id}" class="f1-s-5 cl3 hov-cl10 trans-03">
                  ${response[i].name}
                  </a>
              </h5>

              <span class="cl8">
                  <a href="/${linkPrefix}/category/${response[0].category.id}" class="f1-s-6 cl8 hov-cl10 trans-03">
                    ${response[0].category.name}
                  </a>

                  <span class="f1-s-3 m-rl-3">
                      -
                  </span>

                  <span class="f1-s-3">
                  ${formatTime(response[i].created.time)}
                  </span>
              </span>
          </div>
  </div> `
    }
    articlesHtmlI = articlesHtmlI + '</div>'
  categoryContainer.html(articlesHtml1+articlesHtmlI);
  },
  error: function() {
    console.log('Đã xảy ra lỗi khi tải dữ liệu.');
  }
  });
})

document.addEventListener("DOMContentLoaded", function() {
  const keyword = document.getElementById('textToHighlight').dataset.keyword;
  const elements = document.querySelectorAll('#textToHighlight');

  elements.forEach(element => {
    const content = element.textContent;
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');

    element.innerHTML = content.replace(regex, `<span class="highlight">${keyword}</span>`);
  });
});



