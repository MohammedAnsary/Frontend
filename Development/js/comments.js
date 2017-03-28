$(document).ready(function() {
  $('input').keypress(function(e) {
    if(e.keyCode == 13) {
      var text = $(this).val();
      if(text == '') return;
      console.log($('.input-row'));
      $('.input-row').before('<li class="row">' +
          '<div class="column small-2 image-container">' +
            '<img src="imgs/img3.jpg" alt="image not found">' +
          '</div>' +
          '<div class="column small-10">' +
            '<span class="name-tag">You</span>' +
            '<span class="timestamp"><i class="fa fa-calendar-o" aria-hidden="true"></i> Just now</span>' +
            '<p>' + text + '</p>' +
          '</div>' +
        '</li>');
      $(this).val("");
    }
  });
});