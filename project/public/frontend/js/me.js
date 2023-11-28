  
$(document).ready(function() {
  $('.hover-category').hover(function() {
    var link = $(this).attr('data-link')
   
    $.ajax({
      type: 'GET',
      url: link,
      success: function(data) {
        console.log(data);
        $('#categoryData').html(data); // Hiển thị dữ liệu trả về từ máy chủ trong div #categoryData
      }     
    });
  });
});
