

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





