
// add remove scroll on header
$(window).scroll(function(){
	
	if($(window).scrollTop() <= 20){
	  $('.main-header').removeClass('scroll')
	}else{
	  $('.main-header').addClass('scroll')
	}

});

