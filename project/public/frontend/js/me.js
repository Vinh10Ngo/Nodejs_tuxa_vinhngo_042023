const uploadPath = '/uploads/article/'
function formatTime(fulltime) {
  const date = new Date(fulltime);

  const day = date.getDate();
  const month = date.getMonth() + 1; // Tháng bắt đầu từ 0, cần cộng thêm 1
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate
}



document.addEventListener("DOMContentLoaded", function() {
  const keyword = document.getElementById('textToHighlight').dataset.keyword;
  const elements = document.querySelectorAll('#textToHighlight');
  console.log(keyword);

  elements.forEach(element => {
    const content = element.textContent;
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

    element.innerHTML = content.replace(regex, match => `<span class="highlight">${match}</span>`);
  });
});





