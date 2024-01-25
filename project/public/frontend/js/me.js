

document.addEventListener("DOMContentLoaded", function() {
  const keyword = document.getElementById('textToHighlight').dataset.keyword;
  const elements = document.querySelectorAll('#textToHighlight');

  elements.forEach(element => {
    const name = element.textContent;
    const regex = new RegExp(
      keyword.replace(/./g, function(match) {
        if (match === 'a') {
          return '[aáàảãạâấầẩẫậăắằẳẵặ]';
        } else if (match === 'e') {
          return '[eéèẻẽẹêếềểễệ]';
        } else if (match === 'i') {
          return '[iíìỉĩị]';
        } else if (match === 'o') {
          return '[oóòỏõọôốồổỗộơớờởỡợ]';
        } else if (match === 'u') {
          return '[uúùủũụưứừửữự]';
        } else if (match === 'y') {
          return '[yýỳỷỹỵ]';
        } else {
          return match;
        }
      }),
      'gi'
    );

    element.innerHTML = name.replace(regex, match => `<span class="highlight">${match}</span>`);
  });
});

// Lấy đường dẫn hiện tại
var currentPath = window.location.pathname;

// Lấy danh sách các thẻ li trong menu
var menuItems = document.getElementById('menu').getElementsByTagName('li');

// Kiểm tra từng thẻ li trong menu
for (var i = 0; i < menuItems.length; i++) {
    var menuItemLink = menuItems[i].querySelector('a');

    // So sánh đường dẫn hiện tại với href của từng thẻ a
    if (currentPath === menuItemLink.getAttribute('href')) {
        // Nếu trùng khớp, thêm class main-menu-active và loại bỏ class mega-menu-item
        menuItems[i].classList.add('main-menu-active');
        menuItems[i].classList.remove('mega-menu-item');
    } else {
        // Nếu không trùng khớp, giữ nguyên các class khác của mỗi mục
        menuItems[i].classList.remove('main-menu-active');
    }
}




