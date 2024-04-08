 $(document).ready(function () {
   
    $('select[name="filter_category_frontend"]').change(function() {
        var path = window.location.pathname.split('/')
        var linkRedirect = '/' + path[1] + '/filter_category_frontend/' + $(this).val()
        window.location.pathname = linkRedirect
    })

});
