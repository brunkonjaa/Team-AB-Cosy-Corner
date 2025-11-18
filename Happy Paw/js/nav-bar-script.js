$(document).ready(function(){
$('.nav-btn button').hover(function() {
    $('.nav-btn').removeClass('active');
    $(this).parent('.nav-btn').addClass('active');
});
});