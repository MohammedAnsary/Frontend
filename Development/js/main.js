$('[data-search]').click(function() {
    $('[data-sfield]').show().select();

    $('.data-search').hide();
})
$('[data-sfield]').focusout(function() {
    $('[data-sfield]').hide();
    $('.data-search').show()
})