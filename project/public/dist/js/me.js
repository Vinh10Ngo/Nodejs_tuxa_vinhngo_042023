changeStatus = (link) => {
  console.log(link);
  $.ajax({
    type: 'POST',
    url: link,
    dataType: 'json',
    success: function (data) {
      let status = data.result.status
      let id = data.result.id
      let notify = data.result.notify
      let current = $('.status-' + id)
      let linkStatus = data.linkIndex + 'change-status' + '/'+ id + '/' +status
      let icon = 'fa-check'
      let xtmlClassStatus = 'btn-success'
      if (status === 'inactive') {
        xtmlClassStatus = 'btn-danger'
        icon = 'fa-minus'
          }
        let html = `<a href="javascript:changeStatus('${linkStatus}')" class="my-btn-state rounded-circle btn btn-sm ${xtmlClassStatus} status-${id}"><i class="fas ${icon}"></i></a>`
        // notice(current, notify)
        $(current).replaceWith(html)
      }
  })
}
changeGroupsACP = (link) => {
  console.log(link);
  $.ajax({
    type: 'POST',
    url: link,
    dataType: 'json',
    success: function (data) {
      let groups_acp = data.result.groups_acp
      let id = data.result.id
      let notify = data.result.notify
      let current = $('.groups_acp-' + id)
      let linkGroupsACP = data.linkIndex +  'change-groups_acp' + '/'+ id + '/' +groups_acp
      let iconClass = (groups_acp == 'yes') ? "fa fa-check-square" : "fa fa-square"
      let html = `<a href="javascript:changeGroupsACP('${linkGroupsACP}')" class="${iconClass} groups_acp-${id}"></a>` 
      $(current).replaceWith(html)
      }
  })
}

// $('.ordering').change(function () {
//   let current = $(this)
//   let ordering = $(this).val()
//   let id = $(this).data('id')
//   let link = $(this).data('link')
//   })
//   $.ajax({
//     type: 'POST',
//     url: link,
//     data: {id: 'id', ordering: 'ordering'},
//     success: function (data) {
//       console.log(data);
//       }
//   })



// function notice(current,data) {
//   current.notify(data.title, {
//     className: data.class,
//     position:'top center'
//   })
//   }