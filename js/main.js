
// add remove scroll on header
$(window).scroll(function(){
	
	if($(window).scrollTop() <= 20){
	  $('.main-header').removeClass('scroll')
	}else{
	  $('.main-header').addClass('scroll')
	}

});

// mobile nav open/close
$('#mobile-nav-btn').click(function(e) {

	$('.main-header').toggleClass('open');
	e.preventDefault();

});

// if ($(window).width() > 900) {
// 	$('.main-header').removeClass('open');
// }
